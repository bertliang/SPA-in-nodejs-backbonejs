var eatz =  eatz || {};

eatz.MapTemplate = Backbone.View.extend({

	//A map view using google map

    initialize: function () {
       //google.maps.event.addDomListener(window, 'load', this.render());
    },
     
    // render the map using its template and the GMap Map constructor,
    // and a marker using the GMap Marker constructor.
    render: function () {
        this.$el.html(this.template()); 
        this.map = new google.maps.Map($('#map-content', this.$el)[0], this.model.toJSON());
        this.marker = new google.maps.Marker({position: this.model.get("center"), map: this.map});
        return this;    // support chaining
    },
   
    //enter your map at the parameter latitude (lat) and longitude (lon), 
    //and to create a marker positioned at this center location.
    setCenter: function(latlng){
    	this.map.setCenter(latlng);
        this.marker = new google.maps.Marker({position: latlng, map: this.map});
        return this

    },
    //trigger a 'resize' event on the map,
    resize: function(){
        var self = this;
        google.maps.event.addListenerOnce(this.map, 'idle', function() {
              google.maps.event.trigger(self.map, 'resize');
        });
    },



});
