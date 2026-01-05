module Api
  module V1
    class BaseController < ActionController::API
      include ApiErrorHandler

      protected

      def extract_locale
        locale = params[:locale] || request.headers["Accept-Language"]&.split(",")&.first&.split("-")&.first
        locale = locale.to_sym if locale
        locale = :en unless I18n.available_locales.include?(locale)
        locale || :en
      end
    end
  end
end
