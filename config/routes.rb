Rails.application.routes.draw do
  root "static_pages#home"
  get "information" => "static_pages#information"
  namespace :ecdsa do
    get "generate_key" => "ecdsa#generate_key"
    get "generate_signature" => "ecdsa#generate_signature"
  end

  namespace :api do
    get "select_d" => "generate_key#select_d"
    get "compute_q" => "generate_key#compute_q"
    get "save_private_key" => "generate_key#save_private_key"
    get "save_public_key" => "generate_key#save_public_key"

    post "gs_upload_message" => "generate_signature#upload_message"
    post "gs_upload_private_key" => "generate_signature#upload_private_key"
    get "gs_check_input" => "generate_signature#check_input"
    
    get "gs_select_k" => "generate_signature#select_k"
    get "gs_compute_kg" => "generate_signature#compute_kg"
    get "gs_compute_r" => "generate_signature#compute_r"
    get "gs_compute_inverse_k" => "generate_signature#compute_inverse_k"
    get "gs_hash_message" => "generate_signature#hash_message"
    get "gs_compute_s" => "generate_signature#compute_s"
    get "save_signature" => "generate_signature#save_signature"
  end
end
