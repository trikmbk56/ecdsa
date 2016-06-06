class Api::DownloadController < ApplicationController
  def download_key
    file_path = "ecdsa/key/" + params[:filename]
    send_file file_path, type: "application/x-x509-ca-cert",
      filename: params[:filename], x_sendfile: true
  end

  def download_signature
    file_path = "ecdsa/signature/" + params[:filename]
    send_file file_path, type: "application/x-x509-ca-cert",
      filename: params[:filename], x_sendfile: true
  end
end
