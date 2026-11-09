Rails.application.routes.draw do
  get "/api", to: "connection#show"
  get "/api/colors", to: "colors#index"
end
