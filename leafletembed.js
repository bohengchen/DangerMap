var map;
var ajaxRequest;
var plotlist;
var plotlayers=[];

// get location of client
var gpsPosition;
function init(){
  poisition = getLocation()
}
init();

// marker of your location
var marker;


// get initial position
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    gpsPosition = [position.coords.latitude, position.coords.longitude]
    loadingRemove();
    showButton();
}

function loadingRemove(){
  // var loading = document.getElementById("loading");
  loading.remove();
  initmap();
}

//var form = document.getElementById("form");
function showButton(){
  form.innerHTML = '<button onclick="panToYourPosition()">Your Location</button><input type="text" name="name" id="addr" value="Taipei 101" /><button onclick="goToPosition()">Go!</button>'
}

// go to queried position
function goToPosition(){
  if (typeof marker == 'object'){
    map.removeLayer(marker)
  }
  var addrValue = document.getElementById("addr").value;

  var geocoder = new google.maps.Geocoder();
  var coor = [];

  // geocode and set view
  geocoder.geocode( { 'address': addrValue}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      var latitude = results[0].geometry.location.lat();
      var longitude = results[0].geometry.location.lng();
      // coor = [latitude, longitude];
      coor.push(latitude);
      coor.push(longitude);

      queriedPosition = coor;
      map.setView(queriedPosition, 13);
      marker = L.marker(queriedPosition).addTo(map);
    }
  });
}


// pan to your location
function panToYourPosition() {
  if (typeof marker == 'object'){
    map.removeLayer(marker)
  }
  map.setView(gpsPosition, 13);
  marker = L.marker(gpsPosition).addTo(map);
}

function initmap() {
    // set up the map
    map = new L.Map('map');

    // create the tile layer with correct attribution
    //var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmUrl='https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmNrdXN0YXQiLCJhIjoiY2l2ZXVvNDRhMDBxajJ6bzZzOGwxdTU2eiJ9.A0Dp9WJrs4FPYhh_i327CA';
    //var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMapa> contributors';
    var osmAttrib='Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>a>, Imagery © <a href="http://mapbox.com">Mapbox</a>a>';
    var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 18, attribution: osmAttrib});

    // start the map in South-East England
    map.setView(new L.LatLng(23.900182, 120.836069),8);
    map.addLayer(osm);

    //L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmNrdXN0YXQiLCJhIjoiY2l2ZXVvNDRhMDBxajJ6bzZzOGwxdTU2eiJ9.A0Dp9WJrs4FPYhh_i327CA', {
    //    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>a>, Imagery © <a href="http://mapbox.com">Mapbox</a>a>',
    //    maxZoom: 18
    //}).addTo(map);

    //var marker=L.marker([23.01823,120.219646]).addTo(map);
    // var dataP = readTextFile("crimePoints.csv");
    // addPoints(dataP);
    var dataC = readTextFile("1.0km/allResult.csv");
    addCircles(dataC);
//    var data2 = readTextFile("single_rule_result_2.txt");
//    generatePolygon(data2,"RuleB");
//    var data1 = readTextFile("single_rule_result_1.txt");
//    generatePolygon(data1,"RuleA");
}

function generatePolygon(data,rulename){
	//var test_data =['120.219646', '120.220064', '23.01749', '23.01823']
	var lines = data.split('\n');				//split each line (each object)
    for (var i=0;i<lines.length;i++){
    if (lines[i] === "") {
        continue
    }
		var line_split_data = lines[i].split('\t');	//split id and points info
    //console.log(line_split_data[0])
		var points = line_split_data[1].replace(/[^0-9.,]/g,"").split(',');	//keep only points, remove parentheses & space
		//console.log(points);
		var points_float;
		for(var i2=0;i2<points.length;i2++){
        	var  polygon_obj = L.polygon([
							[parseFloat(points[3]),parseFloat(points[0])],
							[parseFloat(points[3]),parseFloat(points[1])],
							[parseFloat(points[2]),parseFloat(points[1])],
							[parseFloat(points[2]),parseFloat(points[0])],
						   ],{className: rulename}).addTo(map);
            //console.log(each_polygon);
		}
	}
}
function addPoints(data){
    var lines = data.split('\n');
    for (var i=0;i<lines.length-1;i++){
        var line_split_data = lines[i].split(',');
        //console.log(i+","+[parseFloat(line_split_data[1]),parseFloat(line_split_data[2])])
        var circle = L.circle([parseFloat(line_split_data[1]),parseFloat(line_split_data[2])],50, {
                         "color": 'black',
                         "fillColor": '#421010',
                         "fill-opacity": 1
                     }).addTo(map);

//        for(var i2=0;i2<line_split_data.length;i2++){
//            var circle = L.circle([parseFloat(line_split_data[1]),parseFloat(line_split_data[2])],3, {
//                            "color": '#9a9696',
//                            "fillColor": '#421010',
//                            "fill-opacity": 1
//                        }).addTo(map);
//        }
    }
}

function addCircles(data){
    var lines = data.split('\n');
    for (var i=0;i<lines.length-1;i++){
        var line_split_data = lines[i].split(',');
        var marker = L.circle([parseFloat(line_split_data[0]),parseFloat(line_split_data[1])],parseFloat(line_split_data[2]*1000), {
            "color": 'red',
            "fillColor": '#bc2b2b',
            "fill-opacity": 1
        }).addTo(map).bindPopup(parseFloat(line_split_data[3]) + " danger places in this area");
    }
}

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    var allText;
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                //console.log(allText);

            }
        }
    }
    rawFile.send(null);
    return allText;
}
