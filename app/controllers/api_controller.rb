class ApiController < ApplicationController
  before_action :validate_params

  def access_denied
    render :json => 'Access Denied', :status => 403
  end

  private
  
  def validate_params
  end
end
