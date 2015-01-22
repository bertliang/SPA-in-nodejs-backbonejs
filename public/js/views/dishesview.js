var eatz =  eatz || {};


eatz.DishesView = Backbone.View.extend({

    initialize: function () {
       eatz.pubSub.on('eventName', this.render,this); // add pubsub to trigger header view
    },

    render: function () {
          var self = this;
          console.log(eatz.order);
          if(eatz.order){
                if(eatz.order === 'distance'){
                      if(navigator.geolocation){
                            navigator.geolocation.getCurrentPosition(function(result){
                                 self.collection.fetch({
                                    data: {lon:result.coords.longitude, lat:result.coords.latitude},
                                    processData: true,
                                    success: function(dishes){
                                        //console.log(dishes);
                                        self.collection = dishes;

                                        self.collection.comparator = function(dish){
                                            //console.log(dish.get(eatz.order));
                                            return dish.get(eatz.order);
                                        }
                                        self.collection.sort();
                                        //console.log(self.collection);
                                        return self.renderDish(self);
                                     }
                                  });
                             });
                         
                        }else{// not support geolocation
                            eatz.utils.hideNotice();
                            eatz.utils.showNotice('Warnging:', 'info', "Your brower does not support geolocation");
                        }
                 }else{
                     console.log('3');
                     self.collection.comparator = function(dish){
              	         	return dish.get(eatz.order).toLowerCase();
          	         }
                     self.collection.sort();
                     return self.renderDish(self);
                 }
            }else{
                return this.renderDish(this);
            }
          //AR this line needs to be a bit more complicated for jQuery ...
          //AR something like:  $(this.el).html("<ul...></ul>")
          //AR with class thumbnails  (note s at end)
          //$(this.el).html("<ul class='thumbnails'></ul>")
           
          //this.collection.each(function (Dish){
          //    var dv = new eatz.DishView({model:Dish});
            //AR this line needs to be more complicated for jQuery ...
            //AR ending in:  $('<li>').append(dv.render().el);
          //    var item = $('<li>').append(dv.render().el)
            //AR this line should be something like:
            //AR    $('.thumbnails', self.el).append(item);
            //AR and note that self has to be assigned before the loop
          //    $('.thumbnails', self.el).append(item); 
          //});  
	       //return this;    // support chaining
    },

    renderDish: function(self){
          $(self.el).html("<ul class='thumbnails'></ul>")
           
          self.collection.each(function (Dish){
              var dv = new eatz.DishView({model:Dish});
            //AR this line needs to be more complicated for jQuery ...
            //AR ending in:  $('<li>').append(dv.render().el);
              var item = $('<li>').append(dv.render().el)
            //AR this line should be something like:
            //AR    $('.thumbnails', self.el).append(item);
            //AR and note that self has to be assigned before the loop
              $('.thumbnails', self.el).append(item); 
          });  
         return self;    // support chaining

    }

});
