/*Initial variable declarations*/
var app = {};
var GM = google.maps;
var rendererOptions = {
    draggable: false // set true for draggable directions
};
var directionsDisplay = new GM.DirectionsRenderer(rendererOptions); ;
var directionsService = new GM.DirectionsService();
var map;
var defaultPosition = new GM.LatLng(17.3667, 78.4667); // Hyderabad is default location to show on center
var mapOptions = {
    zoom: 12,
    mapTypeId: GM.MapTypeId.ROADMAP,
    center: defaultPosition
};
map = new GM.Map(document.getElementById('map'), mapOptions); // initialize the map

// The function for successful geolocation callback
function success(data) {
    var position = new GM.LatLng(data.coords.latitude, data.coords.longitude),
    niceAddress = "Your location",
	geocoder = new GM.Geocoder();
    geocoder.geocode({ 'latLng': position }, function (results, status) {
        if (status == GM.GeocoderStatus.OK) {
            if (results[0]) {
                console.log(results[0]);
                niceAddress = results[0].formatted_address;
            }
        }
        var infowindow = new GM.InfoWindow({
            map: map,
            position: position,
            content: niceAddress
        });
    });
    map.setCenter(position);
    app.origin = position;
    $('#container').show();
}

// The function for successful geolocation callback
function failure(error) {
    var formResponse = function (e) {
        var geocoder = new GM.Geocoder(),
				position = defaultPosition,
				niceAddress = "Sorry We Couldn't Find Your Location";
        geocoder.geocode(
				{ 'address': document.getElementById("location").value },
				function (results, status) {
					if (status == GM.GeocoderStatus.OK) {
					    if (results[0]) {
					        niceAddress = results[0].formatted_address;
					        position = new GM.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng())
					        console.log(position);
					    }
					}
					var options = {
					    map: map,
					    position: position,
					    content: niceAddress
					},
				infowindow = new GM.InfoWindow(options);
					map.setCenter(options.position);
					document.getElementById("geocode").style.display = "none";
					app.origin = position;
                    $('#container').show();
					//app.destination = 'NIFT, Hyderabad';
					//calcRoute();
				}
			)
        return false;
    }
    var fallback = document.createElement("form");
    fallback.id = "geocode";
    if (error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.log(error.code);
                fallback.innerHTML += "<p>You chose not share geolocation data. <p>Please, use the form below.</p> </p>";
                break;

            case error.POSITION_UNAVAILABLE:
                console.log(error.code);
                fallback.innerHTML += "<p>Sorry, we couldn't determine your location. Please, use the form below. </p>";
                break;

            case error.TIMEOUT:
                console.log(error.code);
                fallback.innerHTML += "<p>Sorry, the location request time out. Please, use the form below. </p>";
                break;

            default:
                fallback.innerHTML += "<p>Sorry, there was an error. Please use the form below. </p>";
                break;
        }
    }
    fallback.innerHTML += "<label for='location'>Enter Your Location <input type='text' id='location' /></label><input type='submit' value='Here' />";
    fallback.onsubmit = formResponse;
    document.getElementById("main").appendChild(fallback);
    //origin = document.getElementById("location").value;
};
/*
The function to load the map with geolocation data
It ensures proper fallback considering almost all the possible errors.
*/
function loadMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, failure, { timeout: 5000 });
    } else {
        failure();
    }
    return true;
}
/*
The function to find the route on the map and to show on the panel
*/
function initialize() {
    var isLoaded = loadMap();
    if (isLoaded) {
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById('directionPanel'));
        GM.event.addListener(directionsDisplay, 'directions_changed', function () {
            computeTotalDistance(directionsDisplay.directions);
        });
    }
}

// The function to calculate route, takes Origin and destination from global app{}
function calcRoute() {
    var request = {
        origin: app.origin,
        destination: app.destination,
        travelMode: GM.DirectionsTravelMode.DRIVING
    };
    directionsService.route(request, function (response, status) {
        if (status == GM.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
}

// The function to calculate total distance
function computeTotalDistance(result) {
    var total = 0;
    var myroute = result.routes[0];
    for (i = 0; i < myroute.legs.length; i++) {
        total += myroute.legs[i].distance.value;
    }
    total = total / 1000.
    document.getElementById('total').innerHTML = total + ' km';
}


// The function to calculate total destination
function getDestination(){
    if ($('#destination').val()) {
        app.destination = $('#destination').val();
        $('#container').hide();
        var geocoder = new GM.Geocoder(),
	position = app.destination,
	destination = "Sorry We Couldn't Find Your Location";
        geocoder.geocode(
	{ 'address': document.getElementById("destination").value },
	function (results, status) {
		if (status == GM.GeocoderStatus.OK) {
		    if (results[0]) {
		        destination = results[0].formatted_address;
		        position = new GM.LatLng(results[0].geometry.location.lat(), results[0].geometry.location.lng())
		        console.log(position);
		    }
		}
		var options = {
		    map: map,
		    position: position,
		    content: destination
		},
	infowindow = new GM.InfoWindow(options);
	});
        calcRoute();
        $('#directionPanel').show();
        $('#message').hide();
    } else {
    $('#directionPanel').show(function () {
        $('#distance').hide();
        $('#message').text("Stay put where you are, driving isn't that fun in this heat").show();
    });
    }
}
$(document).ready(function () {
    initialize();
    $('.switch').toggle(function () {
        $('#directionPanel p').fadeOut(200);
        $('#directionPanel').addClass('hidesudo').animate({
            width: '0',
            padding: '0'
        });
        $('.switch').text('OFF');
    }, function () {
        $('.switch').text('ON');
        $('#directionPanel').animate({
            width: '30%',
            padding: '40px'
        }).removeClass('hidesudo');
        $('#directionPanel').fadeIn(200, function () {
            $('#directionPanel p').fadeIn(200);
        });
    });
});