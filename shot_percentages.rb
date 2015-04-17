#!/usr/bin/env ruby
require 'date'
require 'csv'

files = Dir[ File.join('./data', '**', '*') ].reject { |p| File.directory? p }

Tracker = Struct.new(:attempts, :made) do
    def percentage
        if :made > 0
            :attempts / :made.to_f
        else
            0
        end
    end
end


shot_type = Hash.new (Tracker.new(0,0))
location  = Array.new(50,Array.new(50,Tracker.new(0,0)))
distance  = Hash.new (Tracker.new(0,0))
angle     = Hash.new (Tracker.new(0,0))
assisted  = Hash.new (Tracker(0,0))

counter = 0
files.each do |file|
    date = Date.parse(File.basename(file).split('.')[0])
    CSV.foreach(file, headers: true) do |row|
        if row['etype'] == ('shot' || 'free throw')
            if row['type'].blank?
                type = 'free throw'
            else
                type = row['type']
                x = row['x'].to_i
                y = row['y'].to_i
            end
            shot_type[type][:attempts] += 1
            shot_type[type][:made] += 1 unless row['result'] == 'missed'
            if type != 'free throw'
                location[x][y][:attempts] += 1
                location[x][y][:made] += 1 unless row['result'] == 'missed'

                length = (((45-25)**2+(25-5.25)**2)**(1/2)).round
                distance[length][:attempts] += 1
                distance[length][:made] += 1 unless row['result'] == 'missed'

                shot_angle = (Math.atan2((45-25),(25.25-5.25)) * 180/Math::PI).round
                angle[shot_angle][:attempts] += 1
                angle[shot_angle][:made] += 1 unless row['result'] == 'missed'

                assist = row['assist'].blank?
                assisted[assist][:attempts] += 1
                assisted[assist][:made] += 1 unless row['result'] == 'missed'
            end
        end
    end
    counter += 1
    break if counter.modulo(100) == 0
end
CSV.open("location.csv", "wb") do |csv|
    (0..50).each do |y|
        row = []
        (0..50).each do |x|
            row << location[x][y].percentage
        end
        csv << row
    end
end

