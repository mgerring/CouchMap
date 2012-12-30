// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(window).on('load',function(){
	var couchmap = {
		map : L.map('map').fitWorld(),
		
		tiles : new L.StamenTileLayer( "watercolor", {noWrap:true} ),
		
		markers : new L.LayerGroup(),

		//markers : new L.MarkerClusterGroup({maxClusterRadius:10, zoomToBoundsOnClick:false}),

		spiderfier : new OverlappingMarkerSpiderfier(this.map),

		latlngs : [],

		initMap : function() {
			this.map.addLayer(this.tiles);
		},
		
		addPointsToMap : function(index, value) {
			var latlng = new L.LatLng(value.lat, value.lng);
			var marker = L.marker(latlng);
			var popup = "<img src='"+value.img[0]+"' width='"+value.img[1]+"' height='"+value.img[2]+"' class='profile-img' /><h2>"+value.nicename+"</h2>"+value.ref;
			marker.popup(popup);
			couchmap.markers.addLayer(marker);
			couchmap.latlngs.push(latlng);
		},
		
		loadPoints : function(name) {
			this.markers.clearLayers();
			var callback = this.addPointsToMap;
			$.getJSON('/map/scrape/'+name, function(response,status,xhr){
				$.each(response, callback);
				var bounds = new L.LatLngBounds(couchmap.latlngs);
				couchmap.markers.addTo(couchmap.map);
				couchmap.map.fitBounds(bounds);
				$("#loader").hide();
			});
		},

		bindSearchForm : function(el){
			$(el).submit($.proxy(function(e){
				e.preventDefault();
				$("#loader").show();
				this.loadPoints( $(el).find('input[name="name"]').val() );
			}, this));
		}

	}
	couchmap.initMap();
	couchmap.bindSearchForm('form');
	couchmap.loadPoints(mapdata.username);
});