class RequestedTestsController < ApplicationController

  def update
    error_text=Hash.new
    saved_ok = false
    current_test=''
    encounter = Encounter.find(params[:id])  
    auth_ok = authorize_resource(encounter, UPDATE_ENCOUNTER) 
    if auth_ok
       requested_tests = params["requested_tests"]
       count_all_tests_complete_rejected=0
       set_status_in_progress=false

       requested_tests.each do |test|
         current_test = RequestedTest.find(test[1]["id"])
         saved_ok = current_test.update(status: test[1]["status"], comment: test[1]["comment"]) if current_test
         
         if saved_ok==false
           error_text = current_test.errors.messages
         elsif (RequestedTest.statuses[test[1]["status"]] == RequestedTest.statuses["completed"]) || 
               (RequestedTest.statuses[test[1]["status"]] == RequestedTest.statuses["rejected"])
           count_all_tests_complete_rejected += 1
           set_status_in_progress = true
         elsif RequestedTest.statuses[test[1]["status"]] == RequestedTest.statuses["inprogress"]
           set_status_in_progress = true
         end
       end
      
       if (requested_tests.size > 0) && (requested_tests.size == count_all_tests_complete_rejected)
         encounter.update!(status: Encounter.statuses["completed"])
       elsif set_status_in_progress==true
         encounter.update!(status: Encounter.statuses["inprogress"])
       end
    end
    
    if auth_ok && saved_ok==true
      render json: current_test
    else
      error_text[:error]='not authorised' if !auth_ok
      render json: error_text, status: :unprocessable_entity
    end    
  end
end

