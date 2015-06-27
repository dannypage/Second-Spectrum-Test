#!/usr/bin/env ruby
require 'date'
require 'csv'

files = Dir[ File.join('./data', '**', '*') ].reject { |p| File.directory? p }

shot_type = Hash.new { |hash, key| hash[key] = {:attempts => 0, :made => 0} }

CSV.open("shot_results.csv","wb") do |csv|
    csv << ['date', 'shot_type', 'made', 'attempts', 'percentage']
end

files.each do |file|
    date = Date.parse(File.basename(file).split('.')[0])
    CSV.foreach(file, headers: true) do |row|
        if row['etype'] == 'shot'
            shot_type[row['type']][:attempts] += 1
            shot_type[row['type']][:made] += 1 unless row['result'] == 'missed'
        end
    end
    game += 1
    CSV.open("shot_results.csv","a+") do |csv|
        shot_type.each do |key, info|
            csv << [date, key, info[:made]/info[:attempts].to_f]
        end
    end
end