//wrapping function - dsd
function runViz() {
//window.onload=function(){
$(document).ready(function(){ //jquery ~equivalent for window.onload//

var width = 350;
var height = 350;
var radius = Math.min(width, height) / 3.3;
var outerradius = Math.min(width, height) / 2;
var minimumradiusadjustment = 50;
var innerradius = 25;
var numTicks = 5;
var sdat = new Array();
var main = d3.select('#maincontainer');
var countryselection = ["CHN","IND","USA"] ; 
var url = "";
var roseCharts = [];
var lineChart;
var sparkChart;
var sparkCountry ="CHN";
var indicator = "EH_HealthImpacts";
var subindicator = {name: "Child Mortality", id: "CHMORT", units: "Probability", shortunits: ""};

// JSON for select Boxes 
d3.json("/country_list.json", function(error, json) {  
    var selecthtml = "";
    var active = 0;
    $.each(json, function(name, iso) {
        selecthtml +="<option value=\"" + iso + "\">" + name + "</option>";
    }); 
    $.each(countryselection, function(i, d) {
        $("#clist").append("<select class='clist' id='c" + i + "'>"+selecthtml+"</select>");
        $("#c"+i+" option[value='" + d + "']").prop('selected', true);
        active++;
    });
    
    // Event for checkbox change
    $(".clist").change(function(){
		id = $(this)[0].id[1];
		country = $(this)[0].value;
		countryselection[id] = country;
		
		drawRose(id, country);
		drawLine(id, country);
		drawSpark(country);
	});
    
    initLine();
    initRoses();
    drawSpark(sparkCountry);
});

d3.json("/indicator_list.json", function(error, json) {
	var indhtml = "";
	$.each(json[0], function(id, name){
		indhtml += "<option value=" + id +">" + name +"</option>"
	});
	$(".ind").append("<select id='ind'>" + indhtml + "</select>");
	$(".ind option[value='EH_HealthImpacts']").prop('selected', true);
	
	$("#ind").change(function(){
		indicator = $(this)[0].value;
		initLine();
	});
});

d3.json("/subindicator_list.json", function(error, json) {
	var subindhtml = "";
	var subindicators = json;
	$.each(subindicators, function(i, obj){
		if (obj.id == "CO2GDPd2") return;
		subindhtml += "<option value=" + i +">" + obj.name +"</option>"
	});
	$(".subind").append("<select id='subind'>" + subindhtml + "</select>");
	$(".subind option[value='EH_HealthImpacts']").prop('selected', true);
	
	$("#subind").change(function(){
		subindicator = subindicators[$(this)[0].value];
		// This is the only way to handle the superscript using SVG subtitle and tooltip.
		if (subindicator.shortunits == "mg/m^3") subindicator.shortunits = "mg/m\xB3";
		drawSpark(sparkCountry);
	});
});

// Indicator list setup
$.each(issueColors, function(key, d) {
    d3.select("#leg")
    .append("div").attr("id", key).attr("class", "leg").style("background", issueColors[key])
    .append("div").attr("class", "list").html(cat[key].title);    
});

// General arcs and setup
arc = d3.svg.arc()
    .outerRadius(function (d) {
        if(d.data.value*1<0) d.data.value = 0;
        return radius * (+d.data.value/100) + minimumradiusadjustment;
    })
    .innerRadius(innerradius);

pie = d3.layout.pie()
    .sort(null)
    .value(function (d) {
    return 1;
});

function drawRose(key, country) {
	url = "iso_codes[]="+country+"&";
	var div = d3.select("#country" + key);
	
	var chart = roseCharts[key];
	
	d3.json("/radar_chart.json?years[]=2012&"+url, function(error, json) {
		var country2 = json[0][0],
			country = json[0][0].data;
		
		// Create data object
		var processed_json = new Array();
		var length = indLength(country.indicators);
		var dat = [];
		$.map(country.indicators, function(obj, i) {
			var value = parseFloat(obj.value);
			var y = value;
			
			if (value < 0 || obj.value == "NA")
				return;
			else if (value < 10)
				y = 10;
			
			var col = "#FF0000";
			var idx = 0;
			var ind = "";
			
			// Note that we set index manually, to force
			// the desired order. We can ignore the highcharts error.
			if (obj.name == "EH_AirQuality"){
				col = "#F5C717";
				idx = 1;
				ind = "Air Quality";
			}
			else if (obj.name == "EH_HealthImpacts"){
				col = "#F8951D";
				idx = 0;
				ind = "Health Impacts";
			}
			else if (obj.name == "EH_WaterSanitation"){
				col = "#F36E2B";
				idx = 2;
				ind = "Water & Sanitation";
			}
			else if (obj.name == "EV_Agriculture"){
				col = "#3175B9";
				idx = 4;
				ind = "Agriculture";
			}
			else if (obj.name == "EV_BiodiversityHabitat"){
				col = "#008C8C";
				idx = 7;
				ind = "Biodiversity & Habitat";
			}
			else if (obj.name == "EV_ClimateEnergy"){
				col = "#2DB45D";
				idx = 8;
				ind = "Climate & Energy";
			}
			else if (obj.name == "EV_Fisheries"){
				col = "#3CBCA3";
				idx = 6;
				ind = "Fisheries";
			}
			else if (obj.name == "EV_Forests"){
				col = "#0B9BCC";
				idx = 5;
				ind = "Forests";
			}
			else if (obj.name == "EV_WaterResources"){
				col = "#7D8FC8";
				idx = 3;
				ind = "Water & Resources";
			}
			//options.series[0].data.push({name: obj.name, y: y, color: col, realY: value});
			dat.push({name: obj.name, y: y, color: col, realY: value, indic: ind});
		});
		
		var options = emptyRose(key);
		if (chart == undefined){
			chart = new Highcharts.Chart(options);
			roseCharts[key] = chart;
		}
		else if (chart.series[0].data.length != dat.length){
			chart.destroy();
			chart = new Highcharts.Chart(options);
			roseCharts[key] = chart;
		}

		chart.setTitle({text: country.name});
		chart.series[0].setData(dat, false);
		chart.redraw();
	});
}

function emptyRose(key){
	var options = {
			chart: {
				polar: true,
				type: 'column',
				renderTo: 'country' + key
			},
			series: [{
				type: 'column',
				borderWidth: 2,
				data: []
			}],
			title: {
				text: ''
			},
			pane: {
				startAngle: 0,
				endAngle: 360,
				background: {
					backgroundColor: '#eeeeee'
				}
			},
			legend: {
				reversed: true,
				align: 'right',
				verticalAlign: 'top',
				y: 100,
				layout: 'vertical',
				enabled: false // Disable
			},
			xAxis: {
				categories: [],
				lineWidth: 0,
				tickWidth: 0,
				title: {
					text: ''
				},
				labels: {
					enabled: false
				},
				gridLineWidth: 0
			},
			yAxis: {
				endOnTick: false,
				lineWidth: 0,
				tickWidth: 0,
				title: {
					text: ''
				},
				labels: {
					enabled: false
				},
				gridLineWidth: 0,
				min: 0,
				max: 100,
			},
			tooltip: {
				formatter: function() {
					// Make indicator format pretty
					return '<b>' + this.point.indic + ':</b> '+ (this.point.realY).toFixed(1);
				}
			},
			credits: {
				enabled: false
			},
			plotOptions: {
				column: {
					pointPadding: 0,
					groupPadding: 0,
				},
				series: {
					pointStart: 0,
				},
			}
		};
	
	return options;
}

function initRoses(){
	for (var x = 0; x<3; x++){
		drawRose(x, countryselection[x]);
	}
}

function initLine(){
	var options = {
		chart: {
			type: 'line',
			renderTo: 'lineChart'
		},
		yAxis: {
			min: 0,
			max: 101,
			endOnTick: false,
		},
		series: [],
		title: {
			text: ''
		},
		credits: {
			enabled: false
		},
		tooltip: {
			formatter: function() {
				return this.series.name + '<br> <b>' + this.x + ':</b> ' + this.point.y;
			}
		},
		plotOptions: {
			column: {
				pointPadding: 0,
				groupPadding: 0,
			},
			series: {
				pointStart: 0,
			},
		}
	};
	
	lineChart = new Highcharts.Chart(options);
	
	for(var x=0; x<3; x++){
		var empty = [];
		for(var year = 2002; year<2013; year++)
			empty.push({x: year, y: 0});
		lineChart.addSeries({name: "empty", data: empty});
		drawLine(x, countryselection[x]);
	}
	
}

function drawLine(key, country){
	var x = 0;
    // JSON for line graph
    d3.json("/line_graph.json?indicator=" + indicator + "&iso_codes[]=" + country, function(error, json) {
		var dat = [];
		
		if (json === undefined){
			for(var year = 2002; year<2013; year++)
				dat.push({x: year, y: -1});
		}
		else{
			indicatorData = json.data[0].values; 
			$.map(indicatorData, function(obj, i) {
				dat.push({x: parseInt(obj.year), y: parseInt(obj.value)});
			});
		}
		lineChart.series[key].setData(dat, true);
	});
	
	var col = "";
	if (key == 0)
		col = "#26CBDA";
	else if (key == 1)
		col = "#FF9600";
	else if (key == 2)
		col = "#12E25C";
		
	lineChart.series[key].update({name: country, color: col}, true);
}

function drawSpark(country){
	d3.json("/indicator_trend.json?iso_codes[]=" + country + "&indicators[]=" + subindicator.id, function(error, json) {
		if (! (sparkChart === undefined))
			sparkChart.destroy();
		
		var data = json[0][0].indicator_trend;
		
		// Trim trailing NA's
		var x = 0;
		while(data[x].value == "NA") x++;
		data.splice(0, x);
		
		// Trim ending NA's
		x = data.length-1;
		while(data[x].value == "NA") x--;
		data.splice(x+1, data.length);
		
		var ser = [];
		$.map(data, function(obj, i) {
			var mark = false;
			if (i == 0 || i == data.length-1) mark = true;
			var val = parseFloat(obj.value);
			if (isNaN(val)) val = null;
			ser.push({x: parseInt(obj.year), y: val, marker: {enabled: mark}});
		});
		col = "#FF0000";
		if (subindicator.id == "CHMORT")
			col = "#ff9600";
		else if (subindicator.id == "HAP" || subindicator.id == "PM25" || subindicator.id == "PM25EXBL")
			col = "#f7c80b";
		else if (subindicator.id == "WATSUP" || subindicator.id == "ACSAT")
			col = "#ff6d24";
		else if (subindicator.id == "WASTECXN")
			col = "#7993f2";
		else if (subindicator.id == "AGSUB" || subindicator.id == "POPS")
			col = "#2e74ba";
		else if (subindicator.id == "FORCH")
			col = "#009bcc";
		else if (subindicator.id == "TCEEZ" || subindicator.id == "FSOC")
			col = "#008c8c";
		else if (subindicator.id == "PACOVD" || subindicator.id == "PACOVW" || subindicator.id == "MPAEEZ" || subindicator.id == "AZE")
			col = "#00ccaa";
		else if (subindicator.id == "CO2GDPd1" || subindicator.id == "CO2GDPd2" || subindicator.id == "CO2KWH")
			col = "#1cb85d";
		
		var spark = emptySpark(ser.length);
		spark.plotOptions.line.dataLabels.style.color = col;
		spark.xAxis.labels.style.color = col;
		spark.xAxis.labels.step = ser[ser.length-1].x - ser[0].x;
		spark.subtitle.text = subindicator.units;
		if (subindicator.units.length > 13) spark.subtitle.text = subindicator.shortunits;
		sparkChart = new Highcharts.Chart(spark);
		sparkChart.addSeries({name: country, data: ser, marker: {enabled: false}, color: col}, true);
		
		sparkChart.redraw();
		sparkCountry = country;
	});
}

function emptySpark(){
	var options = {
		exporting: {
			buttons: {
				contextButton: {
					enabled: true,
					align: 'left',
					menuItems: [{
                    text: 'Print',
						onclick: function() {
							this.print();
						}
					},{
						text: 'Save as PNG',
						onclick: function() {
							var svg = this.getSVG(),
								width = parseInt(svg.match(/width="([0-9]+)"/)[1]),
								height = parseInt(svg.match(/height="([0-9]+)"/)[1]),
								canvas = document.createElement('canvas');
								
							canvas.setAttribute('width', width);
							canvas.setAttribute('height', height);
							
							if (canvas.getContext && canvas.getContext('2d')) {
								canvg(canvas, svg);
								var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
								document.write('<img src="'+image+'"/>');
							}
							else {
								alert ("Your browser doesn't support this feature, please use a modern browser");
							}
						},
						separator: false
					}]
				}
			}
		},
		chart: {
			type: 'line',
			renderTo: 'sparkChart',
			marginTop: 60,
			marginRight: 20,
			marginBottom: 20,
			marginLeft: 20
		},
		title:{
			align: 'right',
			verticalAlign: 'top',
			text: 'Raw Data Trend',
			useHTML: false,
			style: {
				'fontSize': '13px',
				'fontWeight': 'bold',
			},
		},
		subtitle:{
			align: 'right',
			y: 25,
			useHTML: false,
			style: {
				'fontSize': '11px',
				'fontStyle': 'italic',
				'fontWeight': 'normal'
			},
		},
		xAxis: {
			lineWidth: 0,
			minorTickLength: 0,
			tickLength: 0,
			gridLineWidth: 0,
			tickInterval: 1,
			labels:{
				staggerLines: 1,
				style: {
					fontWeight: 'bold'
				}
			}
		},
		yAxis: {
			allowDecimals: true,
			gridLineWidth: 0,
			labels: {
				enabled: false
			},
			title: {
				enabled: false
			}
		},
		series: [],
		credits: {
			enabled: false
		},
		legend: {
			enabled: false
		},
		tooltip: {
            useHTML: false,
			formatter: function() {
				var y = this.point.y;
				if (subindicator.id == "CHMORT")
					y = parseFloat(parseFloat(y).toPrecision(2));
				else
					y = parseFloat(Math.round(y * 100) / 100).toFixed(2);
							
				units = subindicator.shortunits;
				return this.series.name + '<br> <b>' + this.x + ':</b> ' + y + " " + units;
			}
		},
		plotOptions: {
			line: {
				//~ connectNulls: true,
				dataLabels: {
					enabled: true,
					align: 'center',
					crop: false,
					overflow: 'none',
					verticalAlign: 'bottom',
					y: -5,
					formatter: function() {
						var y = this.point.y;
						if (subindicator.id == "CHMORT")
							y = parseFloat(parseFloat(y).toPrecision(2));
						else
							y = parseFloat(Math.round(y * 100) / 100).toFixed(2);
							
						var data = sparkChart.series[0].data;
						// Only label first and last 
						if(this.point.x == data[0].x || this.point.x == data[data.length-1].x)
							return y;
						return ''
					},
					style: {
						fontWeight: 'bold'
					}
				}
			}
		}
	};
	return options;
}

function mouseover() {
    //console.log(d3.select(this).select("path"));
    //d3.select(this).select(".piearc").attr("transform", "scale(0.5)")
    
    d3.select(this).select(".piearc").transition()
        .duration(100)
        .attr("transform", "scale(1.1)");
        //.style("fill", function (d) {
        //return colordark(d.data.values[1].values[0].value);
    //});
    d3.select(this).select(".label").transition()
        .duration(200)
        .style("opacity", 0);
}

function mouseout() {
    d3.select(this).select(".piearc").transition()
        .duration(300)
        .attr("transform", "scale(1)");
    //    .style("fill", function (d) {
    //    return color(d.data.values[1].values[0].value);
    //});
    d3.select(this).select(".label").transition()
        .duration(300)
        .style("opacity", 1);
}

function indLength(indicators){
	var count = 0;
	for (var x = 0; x < indicators.length; x++){
		if (indicators[x].value != "NA" && indicators[x].value >= 0)
			count++;
	}
	return count;
}

} //ends mega meta wrapper function
)};
