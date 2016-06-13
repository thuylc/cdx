namespace :ftp do
  desc "Start FTP monitor to download remote files"
  task :start, [:repeat] => :environment do |task, args|   
    run_time = 60
    
    Rails.logger.info "ftp:at start"
    
    if args[:repeat]
       run_time = args[:repeat].to_i
    end   
    
    Rails.logger.info "ftp: before ftpmonitor new"
    FtpMonitor.new(run_time).run!
  end

  desc "Delete the failed file messages as a way to reprocess those files in the next monitoring iteration"
  task reset_failed: :environment do
    FileMessage.where(status: 'failed').delete_all
  end
end
