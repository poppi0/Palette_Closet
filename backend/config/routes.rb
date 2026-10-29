Rails.application.routes.draw do
  get "/api", to: "connection#show"
end
