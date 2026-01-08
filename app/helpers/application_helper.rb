module ApplicationHelper
  def app_version
    # Try APP_VERSION from environment (Docker container)
    # Fall back to RAILS_ENV if not set (local development)
    ENV.fetch("APP_VERSION", Rails.env)
  end
end
