Rails.application.routes.draw do
  root "static_pages#home"
  get "information" => "static_pages#information"
  namespace :ecdsa do
    get "generate_key" => "ecdsa#generate_key"
  end

  namespace :api do
    get "select_d" => "generate_key#select_d"
    get "compute_q" => "generate_key#compute_q"
    get "save_private_key" => "generate_key#save_private_key"
    get "save_public_key" => "generate_key#save_public_key"
  end
end
