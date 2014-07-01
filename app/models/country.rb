class Country < ActiveRecord::Base

  INDICATOR_NAMES = ["EH_HealthImpacts", "EH_AirQuality", "EH_WaterSanitation","EV_WaterResources", "EV_Agriculture", "EV_Forests", "EV_Fisheries", "EV_BiodiversityHabitat", "EV_ClimateEnergy"]
  ISO_CODES = Country.pluck(:iso)
  YEARS = (2002..2012).to_a

  def self.countries_from_params(params)
    params['countries'] || []
  end

  def self.radar_chart(params)
    iso_codes = params['iso_codes'] || ISO_CODES
    indicator_names = params['indicators'] || INDICATOR_NAMES
    years = params['years'] || YEARS
    years.map do |year|  
      iso_codes.map do |iso_code|
        country = Country.find_by(year: year.to_s, iso: iso_code.upcase)
          {
            "year" => year.to_s,
            "data" => {
              "id" => iso_code.upcase,
              "name" => country.country,
              "indicators" => country.indicators(indicator_names)
            }
          }
      end
    end
  end

  def indicators(indicator_names = INDICATOR_NAMES)
    indicator_names.map do |indicator|
      {"name" => indicator, "value" => send(indicator), "subindicators" => subindicators(indicator)}
    end
  end

  def subindicators(indicator)
    if indicator == "EH_HealthImpacts"
      [{"subindicator" => "CHMORT", "value" => send("CHMORT")}]
    elsif indicator == "EH_AirQuality"
      [{"subindicator" => "HAP", "value" => send("HAP")},
       {"subindicator" => "PM25", "value" => send("PM25")},
       {"subindicator" => "PM25EXBL", "value" => send("PM25EXBL")}]
    elsif indicator == "EH_WaterSanitation"
      [{"subindicator" => "WATSUP", "value" => send("WATSUP")},
       {"subindicator" => "ACSAT", "value" => send("ACSAT")}]
    elsif indicator == "EV_WaterResources"
      [{"subindicator" => "WASTECXN", "value" => send("WASTECXN")}]
    elsif indicator == "EV_Agriculture"
      [{"subindicator" => "AGSUB", "value" => send("AGSUB")},
       {"subindicator" => "POPS", "value" => send("POPS")}]
    elsif indicator == "EV_Forests"
      [{"subindicator" => "FORCH", "value" => send("FORCH")}]
    elsif indicator == "EV_Fisheries"
      [{"subindicator" => "TCEEZ", "value" => send("TCEEZ")},
       {"subindicator" => "FSOC", "value" => send("FSOC")}]
    elsif indicator == "EV_BiodiversityHabitat"
      [{"subindicator" => "PACOVD", "value" => send("PACOVD")},
       {"subindicator" => "PACOVW", "value" => send("PACOVW")},
       {"subindicator" => "MPAEEZ", "value" => send("MPAEEZ")},
       {"subindicator" => "AZE", "value" => send("AZE")}]
    elsif indicator == "EV_ClimateEnergy"
      [{"subindicator" => "CO2GDPd1", "value" => send("CO2GDPd1")},
       {"subindicator" => "CO2GDPd2", "value" => send("CO2GDPd2")},
       {"subindicator" => "ACCESS", "value" => send("ACCESS")},
       {"subindicator" => "CO2KWH", "value" => send("CO2KWH")}]
    end
  end

  def self.line_graph(params)
    iso_codes = params['iso_codes']
    indicator_name = params['indicator']

    {
      "indicator" => indicator_name,
      "data" => line_graph_data(indicator_name, iso_codes)
    }
  end

  def self.line_graph_data(indicator_name, iso_codes)
    iso_codes.map do |iso_code|
      {
          "key" => iso_code.upcase,
          "values" => YEARS.map do |year|
            country = Country.find_by(year: year.to_s, iso: iso_code.upcase)
              {
                "year" => year.to_s,
                "value" => country.send(indicator_name)
              }
          end
        }
    end
  end
  
  def self.indicator_list
	[{"EH_HealthImpacts"=>"Health Impacts", "EH_AirQuality"=>"Air Quality", "EH_WaterSanitation"=>"Water and Sanitation", 
	"EV_Agriculture"=>"Agriculture", "EV_Forests"=>"Forests", "EV_Fisheries"=>"Fisheries", 
	"EV_BiodiversityHabitat"=>"Biodiversity and Habitat", "EV_ClimateEnergy"=>"Climate and Energy"}]
  end

  def self.iso_code_list
    Country.pluck(:iso, :country).each_with_object({}){|pair, hash| hash[pair[0]]=pair[1]}
  end

  def self.country_list
    Country.pluck(:country, :iso).each_with_object({}){|pair, hash| hash[pair[0]]=pair[1]}
  end
end
