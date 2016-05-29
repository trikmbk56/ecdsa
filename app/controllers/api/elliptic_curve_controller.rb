class Api::EllipticCurveController < ApplicationController
  def get_elliptic_curve_params
    render json: {p: $ec_group[params[:ec_name]][:p],
      a: $ec_group[params[:ec_name]][:a],
      b: $ec_group[params[:ec_name]][:b],
      g: $ec_group[params[:ec_name]][:g],
      n: $ec_group[params[:ec_name]][:n]}
  end
end
