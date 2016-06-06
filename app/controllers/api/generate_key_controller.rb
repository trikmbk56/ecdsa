class Api::GenerateKeyController < ApplicationController
  @@group = nil
  @@d = nil
  @@q = nil
  @@random = Time.now.to_i.to_s

  def select_d
    @@group = OpenSSL::PKey::EC::Group.new params[:ec_name]
    random_number = rand @@group.order.to_i
    @@d = OpenSSL::BN.new random_number
    render text: @@d.to_s(16)
  end

  def compute_q
    @@q = @@group.generator.mul @@d
    render text: @@q.to_bn.to_s(16)
  end

  def save_private_key
    if @@q == @@group.generator.mul(@@d)
      ec = OpenSSL::PKey::EC.new @@group
      ec.private_key = @@d
      ec.public_key = @@q
      unless Dir.exists? ("ecdsa")
        Dir.mkdir ("ecdsa")
      end
      unless Dir.exists? ("ecdsa/key")
        Dir.mkdir ("ecdsa/key")
      end
      filename = "private_key" + @@random + ".pem"
      File.write("ecdsa/key/" + filename, ec.to_pem)
      render json: {status: "success", filename: filename}
    else
      render json: {status: "fail", text: "Cặp khóa không hợp lệ"}
    end
  end

  def save_public_key
    if @@q == @@group.generator.mul(@@d)
      ec = OpenSSL::PKey::EC.new @@group
      ec.public_key = @@q
      unless Dir.exists? ("ecdsa")
        Dir.mkdir ("ecdsa")
      end
      unless Dir.exists? ("ecdsa/key")
        Dir.mkdir ("ecdsa/key")
      end
      filename = "public_key" + @@random + ".pem"
      File.write("ecdsa/key/" + filename, ec.to_pem)
      render json: {status: "success", filename: filename}
    else
      render json: {status: "fail", text: "Cặp khóa không hợp lệ"}
    end
  end
end
