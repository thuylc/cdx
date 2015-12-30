class AlertsController < ApplicationController
  respond_to :html, :json
  
  expose(:alerts) { current_user.alerts }
  
  #could not name it 'alert' as rails gave a warning as this is a reserved method.
  expose(:alert_info, model: :alert, attributes: :alert_params)

  before_filter do
    head :forbidden unless has_access_to_test_results_index?
  end

  def new
    new_alert_request_variables
    alert_info.alert_recipients.build 
  end

  def index
    @page_size = (params["page_size"] || 10).to_i
    @page = (params["page"] || 1).to_i
    offset = (@page - 1) * @page_size
    
    respond_with alerts
  end

  def edit
    @editing = true
    respond_with alert, location: alert_path
  end

  def show
    respond_with alert, location: alert_path
  end


  def create
    binding.pry
   alert_saved_ok = alert_info.save
   if alert_saved_ok
     
   if params[:alert][:roles]
      roles = params[:alert][:roles].split(',')
      roles.each do |roleid|
        role = Role.find_by_id(roleid)
        alertRecipient = AlertRecipient.new
        alertRecipient.role = role
        #  alertRecipient.user=current_user
        alertRecipient.alert=alert_info
        alertRecipient.save
      end
    end
 
    if alert_info.error_code and alert_info.error_code.include? '-'
      minmax=alert_info.error_code.split('-')
      alert_info.query =    {"test.error_code.min" => minmax[0], "test.error_code.max"=>minmax[1]}
    #elsif alert_info.error_code.include? '*' 
    #   alert_info.query =    {"test.error_code.wildcard" => "*7"}   
    else
      alert_info.query =    {"test.error_code"=>alert_info.error_code }
    end

   if params[:alert][:sites_info]
     sites = params[:alert][:sites_info].split(',')
     query_sites=[]
     sites.each do |siteid|
       site = Site.find_by_id(siteid)
       alert_info.sites << site
       query_sites << site.uuid
     end        
     #Note:  the institution uuid should not be necessary
     alert_info.query=alert_info.query.merge ({"site.uuid"=>query_sites})
   end
   binding.pry
   #TODO you have the device uuid, you don’t even need the site uuid
   if params[:alert][:devices_info]
     devices = params[:alert][:devices_info].split(',')
     query_devices=[]
     devices.each do |deviceid|
       device = Device.find_by_id(deviceid)
       alert_info.devices << device
       query_devices << device.uuid
     end
     #alert_info.query=alert_info.query.merge ({"device.uuid"=>device.uuid})
     alert_info.query=alert_info.query.merge ({"device.uuid"=>query_devices})
   end
 binding.pry
    alert_info.create_percolator  #need to do this for per_record or an aggregation
  end

  respond_to do |format|
    if alert_saved_ok
      format.html { redirect_to alerts_path, notice: 'Alert was successfully created.' }
      format.json { render action: 'show', status: :created, location: alert_info }
    else
      new_alert_request_variables
      format.html { render action: 'new' }
      format.json { render json: alert_info.errors, status: :unprocessable_entity }
    end
  end
  
  end


  def update
    flash[:notice] = "Alert was successfully updated" if alert_info.save
    respond_with alert_info, location: alerts_path
  end


  def destroy
    if alert_info.destroy
      flash[:notice] = "alert was successfully deleted"
      respond_with alert_info
    else
      render :edit
    end
  end

  private

  def alert_params
    params.require(:alert).permit(:name, :description, :error_code, :message, :site_id, :category_type, :aggregation_type, :aggregation_frequency, :channel_type, :sms_limit, :roles, alert_recipients_attributes: [:user, :user_id, :email, :role, :role_id, :id] )
  end
  
  def new_alert_request_variables
    @sites = check_access(Site.within(@navigation_context.entity), READ_SITE)
    @roles = check_access(Role, READ_ROLE)
    @devices = check_access(Device, READ_DEVICE)

    #find all users in all roles
    user_ids = @roles.map { |user| user.id }
    user_ids = user_ids.uniq
    @users = User.where(id: user_ids)
    
  end

end
