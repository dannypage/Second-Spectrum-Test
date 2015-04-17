#!/usr/bin/env ruby
require 'date'
require 'csv'

#def date_parse(date)
#    Date.parse(date)
#rescue => error
#    Date.parse('20071201')
#end

#END_DATE = date_parse(ARGV[0])
TEST_GAMES = 10
files = Dir[ File.join('./data', '**', '*') ].reject { |p| File.directory? p }

def percentage(tracker_hash)
    made = tracker_hash[:made]
    attempts = tracker_hash[:attempts]
    if attempts > 0
        made.to_f / attempts
    else
        0.5
    end
end

location = Hash.new do |hash,key|
    hash[key] = Hash.new do |hash,key|
        hash[key] = {:attempts => 0, :made => 0}
    end
end
shot_type = Hash.new {|h, k| h[k] = {:attempts => 0, :made => 0} }
distance  = Hash.new {|h, k| h[k] = {:attempts => 0, :made => 0} }
angle     = Hash.new {|h, k| h[k] = {:attempts => 0, :made => 0} }
assisted  = Hash.new {|h, k| h[k] = {:attempts => 0, :made => 0} }
all_shots = {:attempts => 0, :made => 0}

game_counter = 0
test_game_counter = 0
testing = false
shot_counter = 0

brier = {
    :shot_type => 0,
    :location  => 0,
    :distance  => 0,
    :angle     => 0,
    :assisted  => 0,
    :all_shots => 0
}

CSV.open("shot_results.csv","wb") do |csv|
    csv << ['games', 'shot_type', 'distance', 'angle', 'assisted', 'all_shots']
end

files.each do |file|
    CSV.foreach(file, headers: true) do |row|
        if row['etype'] == ('shot' || 'free throw')
            if row['type'] == ''
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

                length = (((x-25)**2+(y-5.25)**2)**(0.5)).round
                distance[length][:attempts] += 1
                distance[length][:made] += 1 unless row['result'] == 'missed'

                shot_angle = (Math.atan2((x-25),(y-5.25)) * 180/Math::PI).round
                angle[shot_angle][:attempts] += 1
                angle[shot_angle][:made] += 1 unless row['result'] == 'missed'

                assist = row['assist'].nil? ? false : true
                assisted[assist][:attempts] += 1
                assisted[assist][:made] += 1 unless row['result'] == 'missed'

                all_shots[:attempts] += 1
                all_shots[:made] += 1 unless row['result'] == 'missed'
            end
        end
    end
    game_counter += 1
    if game_counter.modulo(100) == 0  && !testing
        testing           = true
        test_game_counter = 0
        shot_counter      = 0
        testing_shot_type = shot_type.clone
        testing_distance  = distance.clone
        testing_angle     = angle.clone
        testing_assisted  = assisted.clone
        testing_location  = location.clone
        testing_all_shots = all_shots.clone
        brier[:shot_type] = 0
        brier[:distance]  = 0
        brier[:angle]     = 0
        brier[:assisted]  = 0
        brier[:location]  = 0
        brier[:all_shots] = 0
    elsif testing
        CSV.foreach(file, headers: true) do |row|
            if row['etype'] == 'shot'
                type = row['type']
                x = row['x'].to_i
                y = row['y'].to_i

                shot_type_percent = percentage(testing_shot_type[type])
                length = (((x-25)**2+(y-5.25)**2)**(0.5)).round
                distance_percent = percentage(testing_distance[length])

                shot_angle = (Math.atan2((x-25),(y-5.25)) * 180/Math::PI).round
                shot_angle_percent = percentage(testing_angle[shot_angle])
                assist = row['assist'] == '' ? false : true
                assisted_percent = percentage(testing_assisted[assist])
                location_percent = percentage(testing_location[x][y])
                result = row['result'] == 'missed' ? 0 : 1

                all_shot_percentage = percentage(testing_all_shots)

                brier[:shot_type] += (shot_type_percent   - result)**2
                brier[:distance]  += (distance_percent    - result)**2
                brier[:angle]     += (shot_angle_percent  - result)**2
                brier[:assisted]  += (assisted_percent    - result)**2
                brier[:location]  += (location_percent    - result)**2
                brier[:all_shots] += (all_shot_percentage - result)**2
                shot_counter += 1
            end
        end
        test_game_counter += 1
        if test_game_counter == TEST_GAMES
            CSV.open("shot_results.csv","a+") do |csv|
                csv << [game_counter-test_game_counter, brier[:shot_type]/shot_counter, brier[:distance]/shot_counter,
                        brier[:angle]/shot_counter, brier[:assisted]/shot_counter, brier[:all_shots]/shot_counter]
            end
            testing = false
        end
    end
end

#2006-12-21
#{:shot_type=>21.379436703102524, :location=>24.384841900710892, :distance=>24.01203237792804, :angle=>25.299753202386356, :assisted=>53.0, :all_shots=>24.929326408222018}
#2007-12-01
#{:shot_type=>17.413335403254777, :location=>20.811554213104145, :distance=>21.242084082287597, :angle=>21.776610329700034, :assisted=>64.0, :all_shots=>23.983791771095653}
#2007-12-01 - 50% chance if we don't have a calculated percentage
#{:shot_type=>17.413335403254777, :location=>21.061554213104145, :distance=>21.242084082287597, :angle=>21.776610329700034, :assisted=>64.0, :all_shots=>23.983791771095653}

