var eatz =  eatz || {};


eatz.EditView = Backbone.View.extend({

    initialize: function () {
        //get location from the dish model
        var loc = this.model.get('loc');
        var longitude = loc[0];
        var latitude = loc[1];
        // create a map model using dish location
        this.mapModel = new eatz.Map({lat:latitude,lon:longitude});
    },

    render: function () {
        //this.$el.html(this.template()); 
        // create a html on dish model
	      this.$el.html(this.template(this.model.toJSON()));
        this.renderMap(this);  // call map render function
	      return this;    // support chaining
    },

    renderMap: function(self){
       // create a map view on this map model
       self.mapview = new eatz.MapTemplate({model:self.mapModel});
       var center = self.mapModel.get('center');
       //console.log(center);
       $('#google-map', self.el).html(self.mapview.render().el);
       self.mapview.resize();
       setTimeout(function(){
            self.mapview.setCenter(center);
        }, 500); // wait 500ms until setCenter done
    },

    events:{
        'change': 'inputChange',
    	  'click #save': 'saveDish',
    	  'click #delete': 'delete',
        'click #useMyLocation' : 'getLocation',
        'drop #drop-image': 'dropHandler',
        "change #upload-image" : "changePhoto",
        "dragover #drop-image"  : "dragover"
    },

    inputChange: function(event) { 
        var name = event.target.name;
        var value = _.escape(event.target.value);
        data = {};
        data[name] = value;
        var isok = this.model.validateField(name,value);
        if(!isok.isok){
            eatz.utils.showValidationError(name, isok.errormessage);
            this.validate = 1;
        }
        else{
            this.validate = 0;
            eatz.utils.clearValidationError(name);
            this.model.set(data);
            eatz.utils.hideNotice();
            eatz.utils.showNotice('Warnging:', 'info', "click save before you leave");
        }
     },

    // get location function using geolocation
    getLocation: function(){
        event.stopPropagation();
        event.preventDefault();
        var self = this;
        // check if browser support geolocation
        if(navigator.geolocation){
           navigator.geolocation.getCurrentPosition(
              function(result){
                  // set up a new map model in current location
                  self.mapModel = new eatz.Map({lat:result.coords.latitude,lon:result.coords.longitude});
                  //use geocoder to get address information
                  $.ajax({
                      url: 'https://geocoder.ca',
                      type: 'get',
                      async:false,
                      data: {json:'1',
                             latt: result.coords.latitude,
                             longt: result.coords.longitude,
                             geoit:'XML',
                             reverse: '1'},
                      success: function(res){
                         self.model.set({'city': res.city});
                         self.model.set({'number':res.stnumber});
                         self.model.set({'street':res.staddress});
                         self.model.set({'province':res.prov});
                         var loc = [result.coords.longitude, result.coords.latitude];
                         self.model.set({'loc': loc});
                         eatz.utils.hideNotice();
                         eatz.utils.showNotice('Info:', 'info', "Your data is not save yet, click save before you leave");
                      },
                      error: function(res){ // error call from geocoder.ca
                         eatz.utils.hideNotice();
                         eatz.utils.showNotice('Error:', 'error', "cannot get your address, please one more time or another location");
                     }

                  });
                  self.render(); // call redern funtion
                  
              }, 
              function(err){ // err call from geolocation
                  eatz.utils.hideNotice();
                  eatz.utils.showNotice('Error:', 'error', "cannot get your latitude and longitude information");
              },
              {maximumAge: 60000,timeout:10000}
           );
        }else{// not support geolocation
            eatz.utils.hideNotice();
            eatz.utils.showNotice('Warnging:', 'info', "Your brower does not support geolocation");
        }
    },

    beforeSave: function(){
      var user;
      $.ajax({
            url: '/auth',
            type: 'get',
            async: false,
            success: function(res) {              
               user = res; 
            }
        });
       return user;
    },

    saveDish: function() {
        event.stopPropagation();
        event.preventDefault();
        var self = this;
        var m = this.model;
        var i = 0;
        if(this.pictureFile){
        	var file = this.pictureFile;
        	var img = eatz.utils.uploadFile(file);
                m.set({"Image": img});
        }
        if(this.validate == 1){
            eatz.utils.hideNotice();    
            eatz.utils.showNotice('Warning:','info', "your input not correct!");
        }else{
            i = m.validateAll();
            var user = self.beforeSave();
            if(!user.username){
                eatz.utils.showNotice('Sorry:','error', 'You did not sign in yet, cannot add/save Dish!!!');    
                i =i +1;
            }
        }
        if(i==0){
            m.save({}, 
                {wait:true,
                success: function(model) {
                    self.render();
                    eatz.utils.hideNotice()
                    var mId = model.id;                   
                    var tem = 'dishes/' + mId;
                    app.navigate(tem,{trigger: true});
                    eatz.utils.showNotice('Success:', 'success', "Success to save a Dish Model!");
                },   
                error: function(model, response) {
                   console.log(response.responseText)
                   eatz.utils.hideNotice();
                   eatz.utils.showNotice('Error:', 'error', response.responseText);
	        }
             }); 
          }
       
       },

    delete: function() {
        //event.stopPropagation();
        event.preventDefault();
        var self = this;
        var user = this.beforeSave();
        if(!user.username){
            eatz.utils.showNotice('Sorry:','error', 'You did not sign in yet, cannot add/save Dish!!!');
        }else{
    	   self.model.destroy({
             dataType: "text",
             success: function(){
                 app.navigate('dishes',{trigger: true});
             },
             error: function(res){
                console.log(res);
               }
            });
        }
    },

    dragover: function(event) {
            event.preventDefault();
    },

    dropHandler: function (event) {
        event.stopPropagation();
        event.preventDefault();
        //console.log(event);

        var e = event.originalEvent;
        e.dataTransfer.dropEffect = 'copy';
        this.pictureFile = e.dataTransfer.files[0];
        //console.log(this.pictureFile);

        var reader = new FileReader();
        reader.onloadend = function () {
            $('#drop-image img').attr('src', reader.result);
        };
        reader.readAsDataURL(this.pictureFile);
        
    },

    changePhoto:function (event) {
        event.stopPropagation();
        event.preventDefault();
        
        var newFile = event.target.files;
        //var newFile = document.querySelector('button[type=file]').files[0];
        this.pictureFile = newFile[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            $('#drop-image img').attr('src', reader.result);
        };
        reader.readAsDataURL(this.pictureFile);
        
    }

});
