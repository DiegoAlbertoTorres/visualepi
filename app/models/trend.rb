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
		elsif indicator == "CO2GDP"
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
	["CHMORT"=>"Child Mortality", "HAP"=>"Household Air Quality", "PM25"=>"Air Pollution - Average Exposure to PM2.5",
	"PM25EXBL"=>"Air Pollution - PM2.5 Exceedance", "WATSUP"=>"Access to Drinking Water", "ACSAT"=>"Access to Sanitation",
	"WASTECXN"=>"Wastewater Treatment", "AGSUB"=>"Agricultural Subsidies", "POPS"=>"Pesticide Regulation", 
	"FORCH"=>"Change in Forest Cover", "TCEEZ"=>"Coastal Shelf Fishing Pressure", "FSOC"=>"Fish Stocks", 
	"PACOVD"=>"Terrestrial Protected Areas (National Biome Weights)", "PACOVW"=>"Terrestrial Protected Areas (Global Biome Weights)",
	"MPAEEZ"=>"Marine Protected Areas", "AZE"=>"Critical Habitat Protection", "CO2GDPd1"=>"Trend in Carbon Intensity",
	"CO2GDPd2"=>"Change of Trend in Carbon Intensity", "ACCESS"=>"Access to Electricity", "CO2KWH"=>"Trend in CO2 Emissions per KWH"]
	end
end
