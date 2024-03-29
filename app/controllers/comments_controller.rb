class CommentsController < ApplicationController
  respond_to :json
  
  def index
    if params[:comment]
      @comments = Comment.where(params[:comment])
    else
      @comments = Comment.all
    end
    respond_with @comments
  end
  
  def show
    @comment = Comment.find(params[:id])
    respond_with @comment
  end
  
  def create
    @comment = Comment.create(params[:comment])
    respond_with @comment
  end
  
  def update
    @comment = Comment.update(params[:id], params[:comment])
    respond_with @comment
  end
  
  def destroy
    @comment = Comment.destroy(params[:id])
    respond_with @comment
  end
end
