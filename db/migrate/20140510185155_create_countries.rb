class CreateCountries < ActiveRecord::Migration
  def change
    create_table :countries do |t|
      t.string   :year
      t.string   :code 
      t.string   :iso
      t.string   :country
      t.string   :ACCESS
      t.string   :ACSAT
      t.string   :AGSUB
      t.string   :AZE
      t.string   :CHMORT
      t.string   :CLIMATE
      t.string   :CO2GDPd1
      t.string   :CO2GDPd2
      t.string   :CO2KWH
      t.string   :FORCH
      t.string   :FSOC
      t.string   :HAP
      t.string   :MPAEEZ
      t.string   :PACOVD
      t.string   :PACOVW
      t.string   :PM25
      t.string   :PM25EXBL
      t.string   :POPS
      t.string   :TCEEZ
      t.string   :WASTECXN
      t.string   :WATSUP
      t.string   :EH_AirQuality
      t.string   :EH_HealthImpacts
      t.string   :EH_WaterSanitation
      t.string   :EV_Agriculture
      t.string   :EV_BiodiversityHabitat
      t.string   :EV_ClimateEnergy
      t.string   :EV_Fisheries
      t.string   :EV_Forests
      t.string   :EV_WaterResources
      t.string   :EH
      t.string   :EV
      t.string   :EPI

      t.timestamps
    end
  end
end
