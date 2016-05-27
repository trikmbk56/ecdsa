Rails.application.routes.draw do
  root "static_pages#home"
  get "information" => "static_pages#information"
end
