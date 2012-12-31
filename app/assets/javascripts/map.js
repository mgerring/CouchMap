// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.

$(window).on('load',function(){
	var couchmap = {
		map : L.map('map').fitWorld(),
		
		tiles : new L.StamenTileLayer( "watercolor", {noWrap:true} ),
		
		markers : new L.MarkerClusterGroup({maxClusterRadius:20, zoomToBoundsOnClick:false}),

		latlngs : [],

		initMap : function() {
			this.map.addLayer(this.tiles);
		},
		
		addPointsToMap : function(index, value) {
			var latlng = new L.LatLng(value.lat, value.lng);
			var marker = L.marker(latlng);
			var popup = "<img src='"+value.img[0]+"' width='"+value.img[1]+"' height='"+value.img[2]+"' class='profile-img' />";
			popup += "<h2>"+value.nicename+"</h2>";
			popup += "<div class='meta'>";
			popup += "<span class='location'>"+value.loc_name.replace(/^\s\s*/, '').replace(/\s\s*$/, '')+"</span>";
			if (value.host) {
				popup += "<span class='host'>"+value.host+"</span>";
			}
			if (value.surfer) {
				popup += "<span class='surfer'>"+value.surfer+"</span>";	
			}
			popup += "</div>";
			popup += value.ref;
			marker.bindPopup(popup).openPopup();
			couchmap.markers.addLayer(marker);
			couchmap.latlngs.push(latlng);
		},
		
		loadPoints : function(name) {
			this.markers.clearLayers();
			var callback = this.addPointsToMap;
			$.getJSON('/map/scrape/'+name, function(response,status,xhr){
				$.each(response, callback);
				var bounds = new L.LatLngBounds(couchmap.latlngs);
				couchmap.markers.addTo(couchmap.map).on('clusterclick', function (a) {
				    a.layer.spiderfy();
				});
				couchmap.map.fitBounds(bounds);
				$("#loader").hide();
			});
		},

		bindSearchForm : function(el){
			var el = $(el);
			el.submit(function(e){
				e.preventDefault();
				var name = el.find('input[name="name"]').val();
				window.History.pushState({name:name},'Results for '+name,'/'+name);
				$("#loader").show();
			});
			$(window).on('statechange', $.proxy(function(){
				$("#loader").show();
				var state = window.History.getState();
				el.find('input[name="name"]').val( state.data.name );
				this.loadPoints( state.data.name );
			},this));
		}

	}
	couchmap.initMap();
	couchmap.bindSearchForm('form');
	if(mapdata.username) {
		couchmap.loadPoints(mapdata.username);
	} else {
		$("#loader").hide();
	}
});