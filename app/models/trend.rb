#~ Useful for testing:
#~ http://localhost:3000/indicator_trend.json?iso_codes[]=CHN&indicators[]=ACCESS&indicators[]=ACSAT&indicators[]=AGSUB&indicators[]=AZE&indicators[]=CHMORT&indicators[]=CO2GDP&indicators[]=CO2KWH&indicators[]=FORCH&indicators[]=FSOC&indicators[]=HAP&indicators[]=MPAEEZ&indicators[]=PACOVD&indicators[]=PACOVW&indicators[]=PM25EXBL&indicators[]=PM25&indicators[]=POPS&indicators[]=TCEEZ&indicators[]=WASTECXN&indicators[]=WATSUP

class Trend < ActiveRecord::Base
	def self.indicator_trend(params)
		iso_codes = params['iso_codes'] || ISO_CODES
		indicators = params['indicators']
		iso_codes.map do |iso_code|
			indicators.map do |indicator|
				country = Trend.find_by(iso: iso_code.upcase)
				{
					"name" => country.country,
					"indicator_trend" => country.trend(indicator)
				}
			end
		end
	end
	
	def trend(indicator)
		trends = Array.new()
		if indicator == "ACCESS"
			range = *(4..6)
		elsif indicator == "ACSAT"
			range = *(7..28)
		elsif indicator == "AGSUB"
			range = *(29..85)
		elsif indicator == "AZE"
			range = *(86..88)
		elsif indicator == "CHMORT"
			range = *(89..111)
		elsif indicator == "CO2GDPd1"
			range = *(112..132)
		elsif indicator == "CO2KWH"
			range = *(133..153)
		elsif indicator == "FORCH"
			range = *(154..154)
		elsif indicator == "FSOC"
			range = *(155..216)
		elsif indicator == "HAP"
			range = *(217..219)
		elsif indicator == "MPAEEZ"
			range = *(220..242)
		elsif indicator == "PACOVD"
			range = *(243..265)
		elsif indicator == "PACOVW"
			range = *(266..288)
		elsif indicator == "PM25EXBL"
			range = *(289..301)
		elsif indicator == "PM25"
			range = *(302..314)
		elsif indicator == "POPSIGRAT"
			range = *(315..326)
		elsif indicator == "POPS"
			range = *(327..384)
		elsif indicator == "TCEEZ"
			range = *(385..441)
		elsif indicator == "WASTECXN"
			range = *(442..442)
		elsif indicator == "WATSUP"
			range = *(443..464)
		end
		for i in range
			#~ trends.push({"year" => Trend.column_names[i], "value" => send(Trend.column_names[i])})
			trends.push({"year" => Trend.column_names[i].partition('.').last, "value" => send(Trend.column_names[i])})
		end
		trends		
	end
	
	def self.subindicator_list
 	[{"name"=>"Child Mortality", "id"=>"CHMORT", "units"=> "Probability", "shortunits"=>""},
 	{"name"=>"Household Air Quality", "id"=>"HAP", "units"=> "Percentage", "shortunits"=>"%"},
	{"name"=>"Air Pollution - Average Exposure to PM2.5", "id"=>"PM25", "units"=> "Micrograms/m^3", "shortunits"=>"Microg/m^3"},
	{"name"=>"Air Pollution - PM2.5 Exceedance", "id"=>"PM25EXBL", "units"=> "Proportion", "shortunits"=>""},
	{"name"=>"Access to Drinking Water", "id"=>"WATSUP", "units"=> "Percentage", "shortunits"=>"%"},
	{"name"=>"Access to Sanitation", "id"=>"ACSAT", "units"=> "Percentage", "shortunits"=>"%"},
	{"name"=>"Wastewater Treatment", "id"=>"WASTECXN", "units"=> "Percentage", "shortunits"=>"%"},
	{"name"=>"Agricultural Subsidies", "id"=>"AGSUB", "units"=> "Percentage", "shortunits"=>"%"},
	{"name"=>"Pesticide Regulation", "id"=>"POPS", "units"=> "(Out of 25 points)", "shortunits"=>"(Out of 25)"},
	{"name"=>"Change in Forest Cover", "id"=>"FORCH", "units"=> "Percentage", "shortunits"=>"%"},
	{"name"=>"Coastal Shelf Fishing Pressure", "id"=>"TCEEZ", "units"=> "Proportion", "shortunits"=>""},
	{"name"=>"Fish Stocks", "id"=>"FSOC", "units"=> "Proportion", "shortunits"=>""},
	{"name"=>"Terrestrial Protected Areas (National Biome Weights)", "id"=>"PACOVD", "units"=> "Percentage", "shortunits"=>"%"},
	{"name"=>"Terrestrial Protected Areas (Global Biome Weights)", "id"=>"PACOVW", "units"=> "Percentage", "shortunits"=>"%"},
	{"name"=>"Marine Protected Areas", "id"=>"MPAEEZ", "units"=> "Percentage", "shortunits"=>"%"},
	{"name"=>"Critical Habitat Protection", "id"=>"AZE", "units"=> "Percentage", "shortunits"=>"%"},
	{"name"=>"Trend in Carbon Intensity", "id"=>"CO2GDPd1", "units"=> "Unitless", "shortunits"=>""},
	{"name"=>"Change of Trend in Carbon Intensity", "id"=>"CO2GDPd2", "units"=> "Unitless", "shortunits"=>""},
	{"name"=>"Access to Electricity", "id"=>"ACCESS", "units"=> "Percentage", "shortunits"=>"%"},
	{"name"=>"Trend in CO2 Emissions per KWH", "id"=>"CO2KWH", "units"=> "Unitless", "shortunits"=>""}]
	end
end
