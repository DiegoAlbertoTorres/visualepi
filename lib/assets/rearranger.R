for (year in 2002:2011){
  x <- read.csv(paste("./backup1/countries", year, ".csv", sep=""), as.is=TRUE)
  y <- read.csv(paste("./backup1/countries", year, ".csv", sep=""), as.is=TRUE)
  airq <- x$EH_AirQuality
  healthimp <- x$EH_HealthImpacts
  watersan <- x$EH_WaterSanitation
  agric <- x$EV_Agriculture
  biodiv <- x$EV_BiodiversityHabitat
  climate <- x$EV_ClimateEnergy
  fish <- x$EV_Fisheries
  forest <- x$EV_Forests
  waterres <- x$EV_WaterResources
  
  names(x) <- c(names(x[,1:25]), "EH_HealthImpacts", "EH_AirQuality", "EH_WaterSanitation", "EV_WaterResources", "EV_Agriculture",
                "EV_Forests", "EV_Fisheries", "EV_BiodiversityHabitat", "EV_ClimateEnergy", names(x[,35:37]))
  
  x[,26] <- healthimp
  x[,27] <- airq
  x[,28] <- watersan
  x[,29] <- waterres
  x[,30] <- agric
  x[,31] <- forest
  x[,32] <- fish
  x[,33] <- biodiv
  x[,34] <- climate
  
  verif <- vector()
  length(verif) <- 9
  verif <- rep(FALSE, 9)
  verif[1] <- all(x[,26] == y[,27])
  verif[2] <- all(x[,27] == y[,26])
  verif[3] <- all(x[,28] == y[,28])
  verif[4] <- all(x[,29] == y[,34])
  verif[5] <- all(x[,30] == y[,29])
  verif[6] <- all(x[,31] == y[,33])
  verif[7] <- all(x[,32] == y[,32])
  verif[8] <- all(x[,33] == y[,30])
  verif[9] <- all(x[,34] == y[,31])
  
  if (all(verif)){
    write.csv(x, paste("countries", year, ".csv", sep=""))
  }
  else{
    cat("ERROR!", year, " ", sep="")
  }
}


