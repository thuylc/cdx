class CommentsController < ApplicationController
  respond_to :html
  respond_to :json, only: [:index]

  before_filter :find_patient
  before_filter :check_permissions, only: [:new, :create]
  before_filter :find_comment, only: [:show]

  def index
    render json: Presenters::Comments.patient_view(@patient.comments.joins(:user).order(set_order_from_params).limit(30).offset(params[:page] || 0))
  end

  def new
    @comment              = @patient.comments.new
    @comment.commented_on = Date.today
  end

  def create
    @comment              = @patient.comments.new(comment_params)
    @comment.user         = current_user

    if @comment.save_and_audit(current_user, 'New comment added', @comment.comment)
      redirect_to patient_path(@patient), notice: 'Comment was successfully created.'
    else
      render action: 'new'
    end
  end

  def show
  end

  protected

  def find_patient
    @patient = Patient.where(institution: @navigation_context.institution, id: params[:patient_id]).first
  end

  def find_comment
    @comment = @patient.comments.find(params[:id])
  end

  def comment_params
    params.require(:comment).permit(:commented_on, :description, :comment)
  end

  def check_permissions
    redirect_to(patient_path(@patient), error: "You can't add comments to this patient") unless has_access?(@patient, UPDATE_PATIENT)
  end

  def set_order_from_params
    order = params[:order] == 'true' ? 'asc' : 'desc'
    params[:field] == 'name' ? "users.first_name #{order}, users.last_name" : "comments.commented_on #{order}"
  end
end
