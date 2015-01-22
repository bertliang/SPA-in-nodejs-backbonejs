'use strict';

var eatz =  eatz || {};

eatz.User = Backbone.Model.extend({

    urlRoot: "/auth",    

    idAttribute: "_id",   // to match Mongo, which uses _id rather than id

    initialize: function() {

	self = this;

        this.validators = {};

        this.validators.username = function (value) {
            return value.length > 0 ? {isValid: true} :
		{isValid: false, message: "You must enter a non-empty username"};
        };

        this.validators.email = function (value) {
            return ((/^\w+@[a-zA-Z]+\.[a-zA-Z]{2,3}$/.test(value))? 
                {isValid: true} : {isValid: false, message: "You must enter a non-empty email"});
        };

        this.validators.password = function (value) {
            return value.length > 0 ? {isValid: true} :
		{isValid: false, message: "You must enter a non-empty password"};
        };

        this.validators.repassword = function (value) {
            return ((value.length > 0) && (value == self.model.get("password"))) ?
		{isValid: true} : {isValid: false, message: "Password values must match"};
        };
    },

    validateItem: function (key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    }

});
