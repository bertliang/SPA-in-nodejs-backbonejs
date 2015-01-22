"use strict";

// Implement the eatz API:

var fs = require("fs");
var bcrypt = require("bcrypt");
var express = require("express");
var config = require(__dirname + '/../config');


exports.api = function(req, res){
  res.send(200, '<h3>Eatz API is running!</h3>');
};

exports.uploadImage = function (req, res) {
    // req.files is an object, attribute "file" is the HTML-input name attr
    //console.log(req.filees);
    var gm = require('gm');
    var im = gm.subClass({imageMagick: true});
    var filePath = req.files.image.path, 
        tmpFile = req.files.image.name,  
    	  imageURL = 'img/uploads/' + tmpFile,
        writeStream = __dirname + '/../public/' + imageURL; 
    var i = writeStream.lastIndexOf('.');
    var j = imageURL.lastIndexOf('.');
    var img = imageURL.substring(0,j);
    var writeEdit = writeStream.substring(0,i) + '_edit' + '.jpg';
    var writeDish = writeStream.substring(0,i) + '_dish' + '.jpg';
    // process EditView image
    im(filePath).resize(360, 270, "!").write(writeEdit, function(err) {
	 if (err) {
            console.log(err);
	 }else{
        }
    });
    // ADD CODE to process DishView image
    im(filePath).resize(240, 180, "!").write(writeDish , function(err) {  // ADD CODE
    if (!err) {
            res.send(200, img);
            fs.unlink(filePath);
    } else
        console.log(err);
    });
};

exports.getDish = function(req, res){
    console.log('getdish');
    DishModel.findById(req.params.id, function(err, dish) {
        if (err) {
            res.send(500, "Sorry, unable to retrieve dish at this time (" 
                +err.message+ ")" );
        } else if (!dish) {
            res.send(404, "Sorry, that dish doesn't exist; try reselecting from browse view");
        } else {
            res.send(200, dish);
        }
    });
};

exports.addDish = function(req, res){
    //console.log('adddish');
    var dish = new DishModel(req.body);
    //console.log(dish);
    dish.save(function(err, dish) {
        if (err) {
            res.send(500, "Sorry, unable to add dish at this time (" 
                +err.message+ ")" );
        } else if (!dish) {
            res.send(404, "Sorry, venue already exist");
        } else {
            console.log(dish);
            res.send(dish);
        }
    });
};

exports.getDishes = function(req, res){
    if(req.query.lon && req.query.lat){
      var location = [];
      location[0] = parseFloat(req.query.lon);
      location[1] = parseFloat(req.query.lat);
      //console.log(location);
      DishModel.geoNear(
         location, 
         {spherical: true },
         function(err, results, stats) {
            if(err){
               res.send(404, "Sorry, ("
                  +err.errmsg+ ")" );
             } else {
              var dishes = []
              //console.log(results); 
              results.forEach(function(result) {
                  //console.log(Object.isExtensible(result));
                  //console.log(result);
                  //result.obj["distance"] = result.dis;
                  //console.log(result.obj["distance"]);
                  var dish = result.obj.toObject();
                  dish.distance = result.dis;
                  //console.log(dish);
                  dishes.push(dish);
              });
              
              //console.log(dishes);
              res.send(200, dishes);
               // {dis: distance, dishmodel: dishes}
             }
          }
      );
    }else{
       DishModel.find({}, function(err,dishes) {
          if (err) {
              res.send(404, "Sorry, no dishes at were found! ("
                  +err.message+ ")" );
           } else {
              //console.log(dishes);
              res.send(200, dishes);
           }
       });
    }
};

exports.editDish = function(req, res){
    //console.log('editdish');
    var id = req.params.id;
    DishModel.findById(id, function(err, dish) {
        if(!err){
             for (var attr in req.body){
                 dish[attr] = req.body[attr];             
             }
             dish.save(function(saveErr, dish){
                if(!saveErr){
                    res.send(dish);
                } else {
                    res.send("cannot save dish");
                }
              });
        }else{
           res.send(404, "sorry, no dish found by this Id");
        }
    });
};

exports.deleteDish = function(req, res){
    //console.log('deletedish');
    var dishId = req.params.id;
    DishModel.findById(dishId, function(err, dish) {
        if (err) {
            res.send(500, "Sorry, no dish found by id");
        } else {
            dish.remove(function(err){
               if(!err){
                  console.log("delete success");
                  res.send(200);
               }else{
                  console.log("delete fail");
                  res.send(404, "Sorry, cannot delete model");
               }
            });
         }
    });
};


exports.signup = function(req, res) {
    //console.log('signup');
    var user = new UserModel(req.body);
    bcrypt.genSalt(10, function(err, salt) {
    // store the hashed-with-salt password in the DB
        bcrypt.hash(user.password, salt, function(err, hash) {
            user.password = hash;// incorporate hash output and salt value
            user.save(function (err, result) {
                if (!err) {
                    // set username, userid, and auth status on the session
                    req.session.auth = true;
                    req.session.username = result.username;
                    req.session.userid = result.id;
                    //console.log(result);
                    //console.log(req.session);                    
                    res.send({'_id': result.id, 'username': result.username});
                } else {
                    if (err.err.indexOf("E11000") != -1) {
                    // return duplicate-username error response to client
                       res.send(404, "duplicate username error: " + user.username);
                    } else {
                    // return DB error response to client
                     res.send(500, "DataBase error");
                }
            }
      });
    });
  });
};

exports.auth = function(req, res) {
  //console.log('login/loginout');
  if (req.body.login == 1 ) {
    var username =  req.body.username;   // get username ;
    var password =  req.body.password;    // get password ;
    if (!username || !password) {  // client should have ensured this, but just in case
          res.send(403, 'you forget to put username and password');
    };
    UserModel.findOne({'username': username}, function(err, user){
      if (user) {
	bcrypt.compare(password, user.password , function(err, result) {
	  if (result) { // username-password OK
	    req.session.auth = true ; // user logged in
	    req.session.username = user.username ;
	    req.session.userid = user.id ;
	    // extend session-life if "remember-me" checked on login form
            
	    if (req.body.remember == 1 ) {
	        req.session.cookie.maxAge = 1000*60*10; // ... update cookie age ...
	    } 
    	    res.send({'_id': user.id, 'username': user.username});  // return userid/username set to session values
	  } else { // handle various error conditions
            res.send(403, 'wrong password');
      	  }
        });
      } else {
         res.send(403, 'No this user in database!')
	// handle various error conditions
      }
    });
  } else { 
     //console.log('logout');
     req.session.auth = false ; // ... and reset other session fields;
     req.session.userid = null;
     req.session.username = null;
     res.send({'userid': null, 'username':null });  // return userid and username set to null
  }
};

exports.isAuth = function (req, res) {
  //console.log(req.session);
  if (req.session && req.session.auth) {
    res.send({'userid': req.session.userid, 'username': req.session.username});  // return userid and username set to session values
  } else {  // user not authenticated
    res.send({'userid':null,'username':null });  // return userid and username set to null
  };
};



//var config = require("../config");
//console.log(config.db)
var mongoose = require("mongoose");


mongoose.connect(config.db);
//schemas
var Dish = new mongoose.Schema({
    //id: identity,
    name:{ type: String, required:true},
    venue:{ type: String, required:true},
    info:{ type: [String], required:true},
    number:{ type: String, required:true},
    street:{ type: String, required:true},
    city: { type: String, required:true},
    province: { type: String, required: true},
    url: {type: String, required: false},
    Image: {type: String, required: true},
    loc: {type: [Number], required: true}
    //loc:{type:[number], required: true}
});

Dish.index({name:1, venue:1}, {unique: true});
Dish.index({loc: '2d'});

//Dish Models
var DishModel = mongoose.model('Dish', Dish);

// User schemas
var User = new mongoose.Schema({
    username:{type: String, required:true, index:{unique: true}},
    password:{type: String, required: true},
    email:{type:String, required: true}

});
//User Models
var UserModel = mongoose.model('User', User);
