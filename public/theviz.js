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
var charts = [];

// JSON for select Boxes
//d3.json("http://localhost:3000/country_list.json", function(error, json) {  
d3.json("http://epiapi.herokuapp.com/country_list.json", function(error, json) {  
    var selecthtml = "";
    //console.log(json);
    $.each(json, function(name, iso) {
        selecthtml +="<option value=\""+iso+"\">"+name+"</option>";
    }); 
    $.each(countryselection, function(i, d) {  
        $("#clist").append("<select class='clist' id='c"+i+"'>"+selecthtml+"</select>");
        $("#c"+i+" option[value='" + d + "']").prop('selected', true);
    });
    // Events for checkbox change
    $("select").change(function () {
        id = $(this)[0].id[1];
        country = $(this)[0].value;
        countryselection[id] = country;
        drawRose(id, country);
        //drawLine(countryselection);
    })
    .change();
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
		prevdiv = div.selectAll("#rose"+key);
		circle = div.append("div").attr("class", "circle").attr("id", "rose" + key);
	
	var chart = charts[key];
	
	//d3.json("http://localhost:3000/radar_chart.json?years[]=2012&"+url, function(error, json) {
	d3.json("http://epiapi.herokuapp.com/radar_chart.json?years[]=2012&"+url, function(error, json) {
		var country2 = json[0][0],
			country = json[0][0].data;
		console.log(country);
		
		// Create data object
		var processed_json = new Array();
		var length = indLength(country.indicators);
		var dat = [];
		$.map(country.indicators, function(obj, i) {
			var value = parseInt(obj.value);
			var y = value;
			
			if (value < 0 || obj.value == "NA")
				return;
			else if (value < 10)
				y = 10;
			
			var col = "#FF0000";
			var idx = 0;
			
			// Note that we set index manually, to force
			// the desired order. We can ignore the highcharts error.
			if (obj.name == "EH_AirQuality"){
				col = "#F5C717";
				idx = 1;
			}
			else if (obj.name == "EH_HealthImpacts"){
				col = "#F8951D";
				idx = 0;
			}
			else if (obj.name == "EH_WaterSanitation"){
				col = "#F36E2B";
				idx = 2;
			}
			else if (obj.name == "EV_Agriculture"){
				col = "#3175B9";
				idx = 4;
			}
			else if (obj.name == "EV_BiodiversityHabitat"){
				col = "#008C8C";
				idx = 7;
			}
			else if (obj.name == "EV_ClimateEnergy"){
				col = "#2DB45D";
				idx = 8;
			}
			else if (obj.name == "EV_Fisheries"){
				col = "#3CBCA3";
				idx = 6;
			}
			else if (obj.name == "EV_Forests"){
				col = "#0B9BCC";
				idx = 5;
			}
			else if (obj.name == "EV_WaterResources"){
				col = "#7D8FC8";
				idx = 3;
			}
			//options.series[0].data.push({name: obj.name, y: y, color: col, realY: value});
			dat.push({name: obj.name, y: y, color: col, realY: value});
		});
		
		if (chart === undefined){
			var options = initializeRose(key);
			chart = new Highcharts.Chart(options);
			charts[key] = chart;
		}
		else if (dat.length != chart.series[0].data.length){
			chart.destroy();
			prevdiv.remove();
			var options = initializeRose(key);
			chart = new Highcharts.Chart(options);
			charts[key] = chart;
		}

		chart.setTitle({text: country.name});
		chart.series[0].setData(dat, false);
		chart.redraw();
	});
}

function initializeRose(key){
	var options = {
			chart: {
				polar: true,
				type: 'column',
				renderTo: "rose" + key
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
					return '<b>' + this.key + ':</b> '+ (this.point.realY).toFixed(1);
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

function drawLine(cs) {
    url = "";
    $.each(cs, function(i, d) {  
        //url += "iso_codes[]="+d+"&";
        url += "iso_codes[]="+d+"&";
    });
    
    
    // JSON for line graph
    d3.json("http://localhost:3000/line_graph.json?indicator=EH_HealthImpacts&iso_codes[]=" 
			+ countryselection[0] + "&iso_codes[]=" 
			+ countryselection[1] + "&iso_codes[]=" 
			+ countryselection[2], function(error, json) { 
        nv.addGraph(function() {
            var chart = nv.models.lineChart()
            .margin({left: 100})  
            .x(function(d) { return 1*d["year"] })
            .y(function(d) { return 1*d["value"] })
            .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
            .transitionDuration(350)  //how fast do you want the lines to transition?
            .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
            .showYAxis(true)        //Show the y-axis
            .showXAxis(true)        //Show the x-axis
            ;
            
            chart.xAxis.axisLabel('Year').tickFormat(d3.format("d"));
            
            //chart.yAxis.tickFormat(d3.format('.2f'));
            d3.select('#linechart').selectAll("*").remove();
            
            d3.select('#linechart')
            .append("svg")  //Select the <svg> element you want to render the chart in.   
            .datum(json.data)         //Populate the <svg> element with chart data...
            .call(chart);          //Finally, render the chart!
            
            //Update the chart when window resizes.
            nv.utils.windowResize(function() { chart.update() });
            return chart;
        });
    });
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
