class Api::GenerateKeyController < ApplicationController
  @@group = nil
  @@d = nil
  @@q = nil

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
      unless Dir.exists? ("#{Dir.home}" + "/ecdsa")
        Dir.mkdir ("#{Dir.home}" + "/ecdsa")
      end
      unless Dir.exists? ("#{Dir.home}" + "/ecdsa/key")
        Dir.mkdir ("#{Dir.home}" + "/ecdsa/key")
      end
      File.write("#{Dir.home}" + "/ecdsa/key/private_key.pem", ec.to_pem)
      render text: "Đã lưu vào thư mục /home/ecdsa/key"
    else
      render text: "Cặp khóa không hợp lệ"
    end
  end

  def save_public_key
    if @@q == @@group.generator.mul(@@d)
      ec = OpenSSL::PKey::EC.new @@group
      ec.public_key = @@q
      unless Dir.exists? ("#{Dir.home}" + "/ecdsa")
        Dir.mkdir ("#{Dir.home}" + "/ecdsa")
      end
      unless Dir.exists? ("#{Dir.home}" + "/ecdsa/key")
        Dir.mkdir ("#{Dir.home}" + "/ecdsa/key")
      end
      File.write("#{Dir.home}" + "/ecdsa/key/public_key.pem", ec.to_pem)
      render text: "Đã lưu vào thư mục /home/ecdsa/key"
    else
      render text: "Cặp khóa không hợp lệ"
    end
  end
end
