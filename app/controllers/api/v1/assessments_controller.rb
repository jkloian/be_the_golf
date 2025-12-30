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
          error: 'Validation Failed',
          message: e.message,
          details: e.record.errors.full_messages
        }, status: :unprocessable_entity
      end

      def complete
        locale = extract_locale
        session = AssessmentSession.find(params[:id])

        # Validate responses
        responses = response_params[:responses]
        validate_responses!(responses)

        # Save responses
        responses.each do |response_data|
          AssessmentResponse.create!(
            assessment_session: session,
            frame_index: response_data[:frame_index],
            most_choice_key: response_data[:most_choice_key],
            least_choice_key: response_data[:least_choice_key]
          )
        end

        # Score the assessment
        response_array = responses.map do |r|
          {
            most_choice_key: r[:most_choice_key],
            least_choice_key: r[:least_choice_key]
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
        primary_style = scoring_result[:scores].max_by { |_k, v| v }[0]
        secondary_style = scoring_result[:scores].sort_by { |_k, v| -v }[1][0]
        tips = TipsGenerator.generate(
          { primary: primary_style, secondary: secondary_style },
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

        frontend_url = ENV.fetch('FRONTEND_URL', request.base_url)

        render json: {
          assessment_session: session_json(session, include_scores: true, include_persona: true),
          tips: tips,
          share_url: "#{frontend_url}/results/#{session.public_token}"
        }, status: :ok
      rescue ActiveRecord::RecordInvalid => e
        render json: {
          error: 'Validation Failed',
          message: e.message,
          details: e.record.errors.full_messages
        }, status: :unprocessable_entity
      end

      def show_public
        locale = extract_locale
        session = AssessmentSession.find_by!(public_token: params[:public_token])

        unless session.completed?
          render json: {
            error: 'Assessment Not Completed',
            message: 'This assessment has not been completed yet.'
          }, status: :unprocessable_entity
          return
        end

        # Generate tips
        primary_style = session.score_d > session.score_i ? :D : :I
        primary_style = session.send("score_#{primary_style}") > session.score_s ? primary_style : :S
        primary_style = session.send("score_#{primary_style}") > session.score_c ? primary_style : :C

        scores = {
          D: session.score_d,
          I: session.score_i,
          S: session.score_s,
          C: session.score_c
        }
        sorted = scores.sort_by { |_k, v| -v }
        secondary_style = sorted[1][0]

        tips = TipsGenerator.generate(
          { primary: primary_style, secondary: secondary_style },
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

      private

      def assessment_params
        params.require(:assessment_session).permit(:first_name, :gender, :handicap)
      end

      def response_params
        params.permit(responses: [:frame_index, :most_choice_key, :least_choice_key])
      end

      def validate_responses!(responses)
        raise ActionController::ParameterMissing, 'responses' if responses.blank?

        if responses.length != 16
          raise ActionController::BadRequest, 'Exactly 16 responses are required'
        end

        frame_indices = responses.map { |r| r[:frame_index] }.compact.sort
        expected_indices = (1..16).to_a

        unless frame_indices == expected_indices
          raise ActionController::BadRequest, 'All frame indices from 1 to 16 must be present'
        end

        responses.each do |response|
          unless %w[A B C D].include?(response[:most_choice_key])
            raise ActionController::BadRequest, "Invalid most_choice_key: #{response[:most_choice_key]}"
          end

          unless %w[A B C D].include?(response[:least_choice_key])
            raise ActionController::BadRequest, "Invalid least_choice_key: #{response[:least_choice_key]}"
          end

          if response[:most_choice_key] == response[:least_choice_key]
            raise ActionController::BadRequest, 'most_choice_key and least_choice_key must be different'
          end
        end
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

