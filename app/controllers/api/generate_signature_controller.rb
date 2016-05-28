class Api::GenerateSignatureController < ApplicationController
  @@message = nil
  @@d = nil
  @@q = nil
  @@group = nil
  @@k = nil
  @@x1 = nil
  @@r = nil
  @@k_inverse = nil
  @@e = nil
  @@S = nil

  def upload_message
    @@message = params[:message_base64]
    render text: "Upload thông điệp thành công."
  end

  def upload_private_key
    ec = OpenSSL::PKey::EC.new params[:key]
    if ec.private_key?
      @@d = ec.private_key
      @@q = ec.public_key
      render text: "Upload khóa bí mật thành công."
    else
      render text: "Đây không phải khóa bí mật."
    end
  end

  def check_input
    @@group = OpenSSL::PKey::EC::Group.new params[:ec_name]
    if @@message.nil?
      render text: "Chưa upload thông điệp!"
    elsif (@@d.nil? || @@q.nil?)
      render text: "Chưa upload khóa!"
    elsif (@@group.order > @@d) && (@@group.generator.mul(@@d) == @@q)
      render text: "Input hợp lệ."
    else
      render text: "Input không hợp lệ!"
    end
  end

  def select_k
    if @@group.nil?
      render text: "Chưa check input!"
    else
      random_number = rand @@group.order.to_i
      @@k = OpenSSL::BN.new random_number
      render text: @@k.to_s(16)
    end
  end

  def compute_kg
    kg = @@group.generator.mul @@k
    s = kg.to_bn.to_s(16)
    s = s[2, s.length-2]
    @@x1 = s[0, s.length/2].to_i(16).to_bn
    y1 = s[s.length/2, s.length/2].to_i(16).to_bn
    render json: {kg: kg.to_bn.to_s(16), x1: @@x1.to_s(16), y1: y1.to_s(16)}
  end

  def compute_r
    @@r = (@@x1 / @@group.order)[1]
    render text: @@r.to_s(16)
  end

  def compute_inverse_k
    m = @@group.order
    a = @@k
    zero = 0.to_bn
    xa = 1.to_bn
    xm = zero
    while m != zero
      q = (a / m)[0];
      xr = xa - (q * xm);
      xa = xm;
      xm = xr;
      r = (a / m)[1];
      a = m;
      m = r;
    end
    if xa < zero
      xa = @@group.order + xa
    end
    @@k_inverse = xa
    render text: @@k_inverse.to_s(16)
  end

  def hash_message
    digest = OpenSSL::Digest.new params[:hash], @@message
    @@e = digest.to_s.to_i(16).to_bn
    render text: digest.to_s.upcase
  end

  def compute_s
    @@s = @@k_inverse * (@@e + (@@d * @@r))
    @@s = (@@s / @@group.order)[1]
    render text: @@s.to_s(16)
  end

  def save_signature
    signature = @@r * @@group.order + @@s
    unless Dir.exists? ("#{Dir.home}" + "/ecdsa")
      Dir.mkdir ("#{Dir.home}" + "/ecdsa")
    end
    unless Dir.exists? ("#{Dir.home}" + "/ecdsa/signature")
      Dir.mkdir ("#{Dir.home}" + "/ecdsa/signature")
    end
    file_name = "#{Dir.home}" + "/ecdsa/signature/" + "signature" + Time.now.to_i.to_s + ".der"
    File.write(file_name, signature.to_s(16))
    render text: ("Đã lưu vào thư mục " + file_name)
  end
end
