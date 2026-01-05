Rails.application.routes.draw do
  mount RailsAdmin::Engine => "/admin", as: "rails_admin"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # API routes
  namespace :api do
    namespace :v1 do
      post "assessments/start", to: "assessments#start"
      post "assessments/:id/complete", to: "assessments#complete"
      get "assessments/public/:public_token", to: "assessments#show_public"
      get "assessments/dev_preview", to: "assessments#dev_preview" if Rails.env.development?
    end
  end

  # Catch-all route for React Router (must be last)
  get "*path", to: "application#index", constraints: ->(req) { 
    !req.path.start_with?("/rails") && 
    !req.path.start_with?("/vite-test") &&
    !req.path.start_with?("/assets") &&
    !req.path.match?(/\.(css|js|json|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i)
  }
  root "application#index"
end
