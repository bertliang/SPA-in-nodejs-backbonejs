var eatz =  eatz || {};


eatz.AppRouter = Backbone.Router.extend({

    routes: {
        "": "home",
        "about": "about",
        "dishes": "browse",
        "dishes/add": "add",
        "dishes/:id" : "edit"

    },

    initialize: function() {
        eatz.pubSub = _.extend({}, Backbone.Events);
        this.headerView = new eatz.HeaderView();
        $('.header').html(this.headerView.render().el);
    },

    home: function() {
        if (!this.homeView) {
            this.homeView = new eatz.HomeView();
        }
        $('#content').html(this.homeView.el);
        eatz.utils.hideNotice();
        this.headerView.select('brand');
    },

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new eatz.AboutView();
        }
        $('#content').html(this.aboutView.el);
        eatz.utils.hideNotice();
        this.headerView.select('about-memu');
    },

    add: function () {
        var dish = new eatz.Dish();
        var ev = new eatz.EditView({model: dish});  
        $('#content').html(ev.render().el);
        eatz.utils.hideNotice();
        this.headerView.select('Add-memu');
    },

    edit: function (id) {
        eatz.utils.hideNotice();
        var flag;
        if((/^:/).test(id)){
            id = id.substring(1);
            //eatz.utils.showNotice('success', "success to save a Dish model");
            flag=1;
        }
        var dish = new eatz.Dish({"_id": id});
        dish.fetch({
            success: function(dish){
            var ev = new eatz.EditView({model:dish});
            $('#content').html(ev.render().el);
            if(flag==1){
               eatz.utils.showNotice('Success:', 'success', "Success to save a Dish Model!");
            }       
         }
        });
        this.headerView.select('Add-memu');
    },

    browse: function() {
        var self = this;
        if(! this.dishes){
            self.dishes = new eatz.Dishes();
        }
        var dishes = self.dishes;
        //console.log(dishes);
        dishes.fetch({
            success: function (){
                var bv = new eatz.DishesView({collection:dishes});
                $('#content').html(bv.render().el);
                //alert('browse');
            }
        });
        eatz.utils.hideNotice();
        this.headerView.select('Browse-memu');
    }

});
  
//eatz.pubSub = _.extend({}, Backbone.Events);


eatz.utils.loadTemplates(['HomeView', 'HeaderView', "AboutView", "EditView","DishView", "MapTemplate"], function()  {
    app = new eatz.AppRouter();
    Backbone.history.start();
});
