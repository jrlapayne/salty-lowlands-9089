class SourcesController < ApplicationController
  respond_to :json
  
  def index
    if params[:source]
      @sources = Source.where(params[:source])
    else
      @sources = Challenge.all
    end
    respond_with @sources
  end
  
  def show
    @source = Source.find(params[:id])
    respond_with @source
  end
  
  def create
    @source = Source.create(params[:source])
    respond_with @source
  end
  
  def update
    @source = Source.update(params[:id], params[:source])
    respond_with @source
  end
  
  def destroy
    @source = Source.destroy(params[:id])
    respond_with @source
  end
end
