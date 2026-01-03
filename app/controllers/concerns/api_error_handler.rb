module ApiErrorHandler
  extend ActiveSupport::Concern

  included do
    rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found
    rescue_from ActiveRecord::RecordInvalid, with: :handle_validation_error
    rescue_from ActionController::ParameterMissing, with: :handle_parameter_missing
  end

  private

  def handle_not_found(exception)
    render json: {
      error: "Not Found",
      message: exception.message
    }, status: :not_found
  end

  def handle_validation_error(exception)
    render json: {
      error: "Validation Failed",
      message: exception.message,
      details: exception.record.errors.full_messages
    }, status: :unprocessable_content
  end

  def handle_parameter_missing(exception)
    render json: {
      error: "Parameter Missing",
      message: exception.message
    }, status: :bad_request
  end
end
