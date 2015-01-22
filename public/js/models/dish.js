
var eatz =  eatz || {};

eatz.Dish = Backbone.Model.extend({
    
    urlRoot: "/dishes",
    idAttribute: "_id",
  
    defaults: {
      // ADD YOUR CODE HERE
      name: "",
      venue: "",
      info: "",
      number: 1265,
      street: "Military Trail",
      city: "Scarborough",
      province: "ON",
      url: "",
      Image: "img/plate",
      // loc [lon, lat]
      loc: [-79.185323, 43.784925]
    },

    initialize: function () {

      this.validators={};

      this.validators.name=function(value){
        return ((/^[0-9A-Za-z][0-9A-Za-z]*$/.test(value))?{isok:true}:
          {isok:false,errormessage:"one or more letter and/or digit characters"});
      },

      this.validators.venue=function(value){
        return ((/^[0-9A-Za-z][0-9A-Za-z]*$/.test(value))?{isok:true}:
          {isok:false,errormessage:"one or more letter and/or digit characters"});
      },

      this.validators.info=function(value){
        return ((/^[0-9A-Za-z]([0-9A-Za-z]*\s?)*$/.test(value))?{isok:true}:
          {isok:false,errormessage:"one-or-more whitespace-separated words"});
      },

       this.validators.number=function(value){
        return ((/^[0-9]+[0-9A-Za-z]*$/.test(value))?{isok:true}:{isok:false,errormessage:"street cannot be blank and no special character"});
      },

      this.validators.url=function(value){
        return ((/^$|^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value))?{isok:true}:
          {isok:false,errormessage:"empty string or a properly-formatted URL"});
      },

      this.validators.street=function(value){
        return ((/^\s*(?:\s?[A-Za-z]+(?:[\-'+][a-zA-Z]+)?)+\s*$/.test(value))?{isok:true}:
          {isok:false,errormessage:"one-or-more whitespace-separated words"});
      },

      this.validators.city=function(value){
        return ((/^\s*(?:\s?[A-Za-z]+(?:[\-'+][a-zA-Z]+)?)+\s*$/.test(value))?{isok:true}:
          {isok:false,errormessage:"one-or-more whitespace-separated words"});
      },

      this.validators.province=function(value){
        return {isok:true};
      },
      this.validators.Image=function(value){
        return {isok:true};
      }
     
      
    },

    validateField: function(field,value){
      //console.log(field, value);
      return this.validators[field](value);
      
    },

    validateAll: function(){
       //alert('validateAll');
       var i = 0;
       for (var field in this.validators){
           //console.log(field +  this.get(field));
           var isok  = this.validators[field](this.get(field));
           if(!isok.isok){
               eatz.utils.showValidationError(field, isok.errormessage);
                i = i + 1;
            }
            else{
                 eatz.utils.clearValidationError(field);
            }
        }
        return i;
       
    }

});
