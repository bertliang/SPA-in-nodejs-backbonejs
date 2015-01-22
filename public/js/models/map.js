'use strict';

var eatz =  eatz || {};

// a map model using google map
eatz.Map = Backbone.Model.extend({

   defaults: {
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    },

   initialize: function(options) {
   	   var lat;
   	   var lon;
       // check if lat/lon passed, ow set default
       if(options){
          lat = options.lat;
          lon = options.lon;
       }else{
          lat = 43.784925;
          lon = -79.185323;
       }
       // set center to this lat/lon
       this.set({center: new google.maps.LatLng(lat, lon)});
    }

});
