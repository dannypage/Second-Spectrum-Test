#!/usr/bin/env ruby
require 'date'
require 'csv'

files = Dir[ File.join('./data', '**', '*') ].reject { |p| File.directory? p }

#shot_type = Hash.new { |hash, key| hash[key] = {:attempts => 0, :made => 0} }
location = Hash.new do |hash,key|
    hash[key] = Hash.new do |hash,key|
        hash[key] = {:attempts => 0, :made => 0}
    end
end
#distance_angle = Hash.new do |hash,key|
    #hash[key] = Hash.new do |hash,key|
    #    hash[key] = {:attempts => 0, :made => 0}
    #end
#end
#points = Hash.new { |hash, key| hash[key] = {:attempts => 0, :made => 0} }
#assisted = Hash.new { |hash, key| hash[key] = {:attempts => 0, :made => 0} }

#CSV.open("shot_results.csv","wb") do |csv|
#    csv << ['date', 'shot_type', 'made', 'attempts', 'percentage']
#end

counter = 0
files.each do |file|
    date = Date.parse(File.basename(file).split('.')[0])
    CSV.foreach(file, headers: true) do |row|
        if row['etype'] == 'shot'
            #shot_type[row['type']][:attempts] += 1
            #shot_type[row['type']][:made] += 1 unless row['result'] == 'missed'
            x = row['x'].to_i
            y = row['y'].to_i
            location[x][y][:attempts] += 1
            location[x][y][:made] += 1 unless row['result'] == 'missed'
        end
    end
    counter += 1
    puts counter if counter.modulo(100) == 0
end
CSV.open("location.csv", "wb") do |csv|
    (0..50).each do |y|
        row = []
        (0..50).each do |x|
            attempts = location[x][y].fetch(:attempts,0)
            made = location[x][y].fetch(:made,0)
            percent = attempts >0 ? made/attempts.to_f : 0
            row << percent
        end
        csv << row
    end
end

