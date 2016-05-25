namespace :import do
  desc 'Import Test Result data from CSV file'
  task :test_results, [:file, :device] => :environment do |_t, args|
    begin
      p "Importing Test Result data from #{args[:file]}"
      filename = "#{Rails.root.expand_path}/import/#{args[:file]}"
      device_id = args[:device]
      fail "#{filename} does not exist" unless File.exist?(filename)
      # Importers::TestResults.import(filename)
      importer = Importers::TestResults.new(filename, device_id)
      bar = RakeProgressbar.new(importer.rows.count)
      importer.rows.each do |row|
        importer.import(row)
        bar.inc
      end
      bar.finished
    rescue Exception => e
      p "An error occured while importing #{filename}"
      puts e
    end
    p 'Done!!'
  end
end
