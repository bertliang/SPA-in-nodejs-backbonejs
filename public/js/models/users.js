// eatz dishes Collection
// ---------------
// The collection of eatz dishes is backed by *localStorage* instead of a remote
var eatz =  eatz || {};



eatz.Users = Backbone.Collection.extend({
  url: "/auth",
  // Reference to this collection's model.
  model: eatz.User, 

  // Save all of the Dish items under the `"Dishes-backbone"` namespace.
  //localStorage: new Backbone.LocalStorage('eatz')

});
