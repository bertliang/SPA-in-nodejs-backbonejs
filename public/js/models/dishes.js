// eatz dishes Collection
// ---------------
// The collection of eatz dishes is backed by *localStorage* instead of a remote
var eatz =  eatz || {};



eatz.Dishes = Backbone.Collection.extend({
  url: "/dishes",
  // Reference to this collection's model.
  model: eatz.Dish, 

  // Save all of the Dish items under the `"Dishes-backbone"` namespace.
  //localStorage: new Backbone.LocalStorage('eatz')

});
