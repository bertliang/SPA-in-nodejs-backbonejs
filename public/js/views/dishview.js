var eatz =  eatz || {};

eatz.DishView = Backbone.View.extend({

	//tagName: 'li',

    initialize: function () {
		//this.render();
    },

    render: function () {

	this.$el.html(this.template(this.model.toJSON()));  
	return this;    // support chaining
    }

});