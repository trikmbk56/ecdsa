Rails.application.routes.draw do
  root "static_pages#home"
  get "information" => "static_pages#information"
  namespace :ecdsa do
    get "generate_key" => "ecdsa#generate_key"
    get "generate_signature" => "ecdsa#generate_signature"
    get "verify_signature" => "ecdsa#verify_signature"
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

    post "vs_upload_message" => "verify_signature#upload_message"
    post "vs_upload_signature" => "verify_signature#upload_signature"
    post "vs_upload_public_key" => "verify_signature#upload_public_key"
    get "vs_check_input" => "verify_signature#check_input"

    get "vs_boolean1" => "verify_signature#boolean1"
    get "vs_hash_message" => "verify_signature#hash_message"
    get "vs_compute_w" => "verify_signature#compute_w"
    get "vs_compute_u1" => "verify_signature#compute_u1"
    get "vs_compute_u2" => "verify_signature#compute_u2"
    get "vs_compute_x" => "verify_signature#compute_x"
    get "vs_compute_v" => "verify_signature#compute_v"
    get "vs_vsrify_signature" => "verify_signature#verify_signature"
  end
end
