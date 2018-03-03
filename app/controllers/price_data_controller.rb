class PriceDataController < ApiController
  require 'price_data_converter'

  def get_data
    dataConverter = PriceDataConverter.new(
      params[:resolution],
      params[:start].to_i,
      DateTime.now.to_i
    )
    dataConverter.aggregate_data_points(30)
    render :json => dataConverter.data
  end

  private

  def validate_params
    return true if resolutions.include? params[:resolution]
    access_denied
    return false
  end

  def resolutions
    ['month', 'day']
  end
end
