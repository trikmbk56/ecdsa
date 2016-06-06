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
  @@check = false
  @@random = Time.now.to_i.to_s

  def upload_message
    @@message = params[:message_base64]
    render text: "Upload thông điệp thành công."
  end

  def upload_private_key
    ec = OpenSSL::PKey::EC.new params[:key]
    if ec.private_key?
      @@d = ec.private_key
      @@q = ec.public_key
      render json: {type: "success", text: "Upload khóa bí mật thành công."}
    else
      render json: {type: "error", text: "Đây không phải khóa bí mật."}
    end
  end

  def check_input
    @@group = OpenSSL::PKey::EC::Group.new params[:ec_name]
    if @@message.nil?
      render json: {type: "warning", text: "Chưa upload thông điệp!"}
    elsif (@@d.nil? || @@q.nil?)
      render json: {type: "warning", text: "Chưa upload khóa!"}
    elsif (@@group.order > @@d) && (@@group.generator.mul(@@d) == @@q)
      @@check=true
      render json: {type: "success", text: "Input hợp lệ."}
    else
      render json: {type: "error", text: "Input không hợp lệ!"}
    end
  end

  def select_k
    if !@@check
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
    int_r = OpenSSL::ASN1::Integer.new(@@r, 0, :EXPLICIT)
    int_s = OpenSSL::ASN1::Integer.new(@@s, 0, :EXPLICIT)
    seq = OpenSSL::ASN1::Sequence.new([int_r, int_s])
    signature = seq.to_der
    unless Dir.exists? ("ecdsa")
      Dir.mkdir ("ecdsa")
    end
    unless Dir.exists? ("ecdsa/signature")
      Dir.mkdir ("ecdsa/signature")
    end
    filename = "signature" + @@random + ".der"
    File.write("ecdsa/signature/" + filename, signature.unpack("H*").first)
    render json: {status: "success", filename: filename}
  end
end
