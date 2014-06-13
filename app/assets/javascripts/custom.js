(function($){

	$(document).ready(function() {

	   setup_gmap();

       /* enable local scroll for # links */
        $.localScroll();     

	});

    /* this function will setup and display google maps as contact section background */
    function setup_gmap() {
        // Basic options for a simple Google Map
        // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
        var mapOptions = {
            // How zoomed in you want the map to start at (always required)
            zoom: 11,

            // The latitude and longitude to center the map (always required)
            center: new google.maps.LatLng(40.4700, -73.9400), // New York

            scrollwheel: false,
            streetViewControl: false,
            disableDefaultUI: false,
            mapTypeControl: false,
            scaleControl: false, 
            panControl: false,
            rotateControl: false,
            zoomControl: false,                   
            draggable: true,

            // How you would like to style the map. 
            // This is where you would paste any style found on Snazzy Maps.
            styles: [
                {"featureType":"water","elementType":"geometry","stylers":[{"color":"#130114"},{"lightness":0}]},
                {"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#130114"},{"lightness":1}]},
                {"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"visibility":"off"},{"color":"#130114"},{"lightness":10}]},
                {"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":0},
                {"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":18}]},
                {"featureType":"road.local","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":10}]},
                {"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},
                {"elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":16}]},
                {"elementType":"labels.text.fill","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":40}]},
                {"elementType":"labels.icon","stylers":[{"visibility":"off"}]},
                {"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},
                {"featureType":"administrative","elementType":"geometry.fill","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":20}]},
                {"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"visibility":"off"},{"color":"#000000"},{"lightness":17},{"weight":1.2}]}]
        };

        // Get the HTML DOM element that will contain your map 
        // We are using a div with id="map" seen below in the <body>
        var mapElement = document.getElementById('map');
        //var mapElement = $('#contact-wrap');

        // Create the Google Map using out element and options defined above
        var map = new google.maps.Map(mapElement, mapOptions);          
    }

})(jQuery);