class Api::VerifySignatureController < ApplicationController
  @@message = nil
  @@signature = nil
  @@q = nil
  @@group = nil
  @@r = nil
  @@s = nil
  @@check = false
  @@e = nil
  @@w = nil
  @@u1 = nil
  @@u2 = nil
  @@xx = nil
  @@p = nil
  @@x = nil
  @@v

  def upload_message
    @@message = params[:message_base64]
    render text: "Upload thông điệp thành công."
  end

  def upload_signature
    @@signature = params[:signature].to_i(16).to_bn
    render text: "Upload chữ ký thành công."
  end

  def upload_public_key
    ec = OpenSSL::PKey::EC.new params[:key]
    if ec.public_key?
      @@q = ec.public_key
      render text: "Upload khóa bí mật thành công."
    else
      render text: "Đây không phải khóa bí mật."
    end
  end

  def check_input
    @@group = OpenSSL::PKey::EC::Group.new params[:ec_name]
    str_p = $ec_group[params[:ec_name]][:p]
    @@p = str_p.to_i(16).to_bn
    if @@message.nil?
      render text: "Chưa upload thông điệp!"
    elsif @@signature.nil?
      render text: "Chưa upload chữ ký!"
    elsif @@q.nil?
      render text: "Chưa upload khóa!"
    elsif @@q.group == @@group
      @@check = true
      render text: "Input hợp lệ."
    else
      render text: "Input không hợp lệ!"
    end
  end

  def boolean1
    if !@@check
      render json: {error: "Chưa check input!"}
    else
      temp = @@signature / @@group.order
      @@r = temp[0]
      @@s = temp[1]
      if (@@r >= @@group.order) || (@@s >= @@group.order)
        result = "Sai, không chấp nhận chữ ký."
      else
        result = "Đúng, tiếp tục."
      end
      render json: {r: @@r.to_s(16), s: @@s.to_s(16), result: result}
    end
  end

  def hash_message
    digest = OpenSSL::Digest.new params[:hash], @@message
    @@e = digest.to_s.to_i(16).to_bn
    render text: digest.to_s.upcase
  end

  def compute_w
    @@w = inverse @@s, @@group.order
    render text: @@w.to_s(16)
  end

  def compute_u1
    @@u1 = ((@@e * @@w) / @@group.order)[1]
    render text: @@u1.to_s(16)
  end

  def compute_u2
    @@u2 = ((@@r * @@w) / @@group.order)[1]
    render text: @@u2.to_s(16)
  end

  def compute_x
    point1 = @@group.generator.mul(@@u1)
    point2 = @@q.mul(@@u2)
    n = @@group.order

    s = point1.to_bn.to_s(16)
    s = s[2, s.length-2]
    x1 = s[0, s.length/2].to_i(16).to_bn
    y1 = s[s.length/2, s.length/2].to_i(16).to_bn

    s = point2.to_bn.to_s(16)
    s = s[2, s.length-2]
    x2 = s[0, s.length/2].to_i(16).to_bn
    y2 = s[s.length/2, s.length/2].to_i(16).to_bn

    lamda = (y2 - y1) * inverse((x2 - x1), @@p)
    lamda = (lamda / @@p)[1]
    xr = lamda * lamda - x1 - x2
    yr = lamda * (x1 - xr) - y1
    xr = (xr / @@p)[1]
    if xr < 0.to_bn
      xr = @@p + xr
    end
    yr = (yr / @@p)[1]
    if yr < 0.to_bn
      yr = @@p + yr
    end
    @@xx = xr
    x_bn = ("04" + xr.to_s(16) + yr.to_s(16)).to_i(16).to_bn
    byebug
    @@x = OpenSSL::PKey::EC::Point.new @@group, x_bn
    render json: {xx: xr.to_s(16), yx: yr.to_s(16)}
  end

  def compute_v
    if @@x.infinity?
      render text: "X là điểm vô cực. Không chấp nhận chữ ký."
    else
      @@v = (@@xx / @@group.order)[1]
      render text: @@v.to_s(16)
    end
  end

  def verify_signature
    if @@v == @@r
      render text: "true"
    else
      render text: "false"
    end
  end

  private
  def inverse a, m
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
    xa
  end
end