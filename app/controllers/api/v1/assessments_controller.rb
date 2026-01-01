module Api
  module V1
    class AssessmentsController < BaseController
      def start
        locale = extract_locale

        # Validate input
        session_params = assessment_params
        session_params[:started_at] = Time.current

        session = AssessmentSession.create!(session_params)

        frames = GolfAssessment.frames(locale)

        render json: {
          assessment_session: session_json(session),
          frames: frames.map do |frame|
            {
              index: frame[:index],
              options: frame[:options].map do |option|
                {
                  key: option.key,
                  text: option.text
                }
              end
            }
          end
        }, status: :created
      rescue ActiveRecord::RecordInvalid => e
        render json: {
          error: "Validation Failed",
          message: e.message,
          details: e.record.errors.full_messages
        }, status: :unprocessable_entity
      end

      def complete
        locale = extract_locale
        session = AssessmentSession.find(params[:id])

        # Validate responses
        responses = response_params[:responses]
        validation_error = validate_responses(responses)
        if validation_error
          render json: validation_error, status: :bad_request
          return
        end

        # Save responses
        responses.each do |response_data|
          AssessmentResponse.create!(
            assessment_session: session,
            frame_index: response_data["frame_index"] || response_data[:frame_index],
            most_choice_key: response_data["most_choice_key"] || response_data[:most_choice_key],
            least_choice_key: response_data["least_choice_key"] || response_data[:least_choice_key]
          )
        end

        # Score the assessment
        response_array = responses.map do |r|
          {
            most_choice_key: r["most_choice_key"] || r[:most_choice_key],
            least_choice_key: r["least_choice_key"] || r[:least_choice_key]
          }
        end
        scoring_result = AssessmentScorer.score(response_array)

        # Resolve persona
        persona = PersonaResolver.resolve(
          scoring_result[:scores],
          session.gender,
          locale
        )

        # Generate tips
        tips = TipsGenerator.generate(
          scoring_result[:scores],
          persona[:code],
          locale
        )

        # Update session
        session.update!(
          score_d: scoring_result[:scores][:D],
          score_i: scoring_result[:scores][:I],
          score_s: scoring_result[:scores][:S],
          score_c: scoring_result[:scores][:C],
          most_d: scoring_result[:raw_counts][:most_d],
          least_d: scoring_result[:raw_counts][:least_d],
          most_i: scoring_result[:raw_counts][:most_i],
          least_i: scoring_result[:raw_counts][:least_i],
          most_s: scoring_result[:raw_counts][:most_s],
          least_s: scoring_result[:raw_counts][:least_s],
          most_c: scoring_result[:raw_counts][:most_c],
          least_c: scoring_result[:raw_counts][:least_c],
          persona_code: persona[:code],
          persona_name: persona[:name],
          example_pro_male: persona[:example_pro_male],
          example_pro_female: persona[:example_pro_female],
          display_example_pro: persona[:display_example_pro],
          completed_at: Time.current
        )

        frontend_url = ENV.fetch("FRONTEND_URL", request.base_url)

        render json: {
          assessment_session: session_json(session, include_scores: true, include_persona: true),
          tips: tips,
          share_url: "#{frontend_url}/results/#{session.public_token}"
        }, status: :ok
      rescue ActiveRecord::RecordInvalid => e
        render json: {
          error: "Validation Failed",
          message: e.message,
          details: e.record.errors.full_messages
        }, status: :unprocessable_entity
      end

      def show_public
        locale = extract_locale
        session = AssessmentSession.find_by!(public_token: params[:public_token])

        unless session.completed?
          render json: {
            error: "Assessment Not Completed",
            message: "This assessment has not been completed yet."
          }, status: :unprocessable_entity
          return
        end

        # Generate tips
        scores = {
          D: session.score_d,
          I: session.score_i,
          S: session.score_s,
          C: session.score_c
        }

        tips = TipsGenerator.generate(
          scores,
          session.persona_code,
          locale
        )

        render json: {
          assessment: {
            first_name: session.first_name,
            gender: session.gender,
            handicap: session.handicap,
            scores: {
              D: session.score_d,
              I: session.score_i,
              S: session.score_s,
              C: session.score_c
            },
            persona: {
              code: session.persona_code,
              name: session.persona_name,
              display_example_pro: session.display_example_pro
            },
            completed_at: session.completed_at
          },
          tips: tips
        }, status: :ok
      end

      def dev_preview
        unless Rails.env.development?
          render json: {
            error: "Not Available",
            message: "This endpoint is only available in development mode."
          }, status: :forbidden
          return
        end

        locale = extract_locale

        # Parse scores from params
        scores = {
          D: params[:score_d]&.to_i || params[:scores]&.dig(:D)&.to_i || 50,
          I: params[:score_i]&.to_i || params[:scores]&.dig(:I)&.to_i || 50,
          S: params[:score_s]&.to_i || params[:scores]&.dig(:S)&.to_i || 50,
          C: params[:score_c]&.to_i || params[:scores]&.dig(:C)&.to_i || 50
        }

        # Get gender from params (default to male)
        gender = params[:gender] || "male"
        gender = "male" unless %w[male female unspecified].include?(gender)

        # Resolve persona if not provided
        persona_code = params[:persona_code]&.upcase
        if persona_code.blank?
          persona = PersonaResolver.resolve(scores, gender, locale)
          persona_code = persona[:code]
        else
          # Get persona data for the provided code
          persona_data = I18n.t("personas.#{persona_code}", locale: locale, raise: true)
          display_example_pro = case gender
          when "male"
            persona_data[:example_pro_male]
          when "female"
            persona_data[:example_pro_female]
          else
            persona_data[:example_pro_male]
          end

          persona = {
            code: persona_code,
            name: persona_data[:name],
            display_example_pro: display_example_pro
          }
        end

        # Generate tips using real TipsGenerator
        tips = TipsGenerator.generate(
          scores,
          persona_code,
          locale
        )

        render json: {
          assessment: {
            first_name: "Dev",
            gender: gender,
            scores: scores,
            persona: {
              code: persona[:code],
              name: persona[:name],
              display_example_pro: persona[:display_example_pro]
            },
            completed_at: Time.current
          },
          tips: tips
        }, status: :ok
      rescue I18n::MissingTranslationData => e
        render json: {
          error: "Invalid Persona",
          message: "Persona code '#{persona_code}' not found."
        }, status: :bad_request
      end

      private

      def assessment_params
        params.require(:assessment_session).permit(:first_name, :gender, :handicap)
      end

      def response_params
        params.permit(responses: [ :frame_index, :most_choice_key, :least_choice_key ])
      end

      def validate_responses(responses)
        return { error: "Validation Failed", message: "responses parameter is required" } if responses.blank?

        if responses.length != 16
          return { error: "Validation Failed", message: "Exactly 16 responses are required" }
        end

        # ActionController::Parameters uses string keys, but also supports symbol access
        frame_indices = responses.filter_map { |r| (r["frame_index"] || r[:frame_index]).to_i }.sort
        expected_indices = (1..16).to_a

        unless frame_indices == expected_indices
          return { error: "Validation Failed", message: "All frame indices from 1 to 16 must be present" }
        end

        responses.each do |response|
          most_key = response["most_choice_key"] || response[:most_choice_key]
          least_key = response["least_choice_key"] || response[:least_choice_key]

          unless %w[A B C D].include?(most_key)
            return { error: "Validation Failed", message: "Invalid most_choice_key: #{most_key}" }
          end

          unless %w[A B C D].include?(least_key)
            return { error: "Validation Failed", message: "Invalid least_choice_key: #{least_key}" }
          end

          if most_key == least_key
            return { error: "Validation Failed", message: "most_choice_key and least_choice_key must be different" }
          end
        end

        nil
      end

      def session_json(session, include_scores: false, include_persona: false)
        json = {
          id: session.id,
          public_token: session.public_token,
          first_name: session.first_name,
          gender: session.gender,
          handicap: session.handicap,
          started_at: session.started_at
        }

        if include_scores
          json[:scores] = {
            D: session.score_d,
            I: session.score_i,
            S: session.score_s,
            C: session.score_c
          }
        end

        if include_persona
          json[:persona] = {
            code: session.persona_code,
            name: session.persona_name,
            example_pro_male: session.example_pro_male,
            example_pro_female: session.example_pro_female,
            display_example_pro: session.display_example_pro
          }
        end

        json[:completed_at] = session.completed_at if session.completed_at

        json
      end
    end
  end
end
