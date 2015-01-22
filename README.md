# SPA-in-nodejs-backbonejs
This is Single Page App using backbone.js for client side, node.js for server side, mongodb for database.
(This is a UTSC web project, please no copy and paste)

# Feature

1. User create account, login/logout, use bcrypt to encrypt user password
2. User add dish info to server.
3. "use my location" uses html5 geolocation to get user actual location
4. google map API to display actual map localtion to user.
5. geocoder get address information to fill in automatic
6. GraphicsMagick(gm) to handle upload image to two different size in editview and dishesview
7. html5 dragover feature to drag and drop image
8. use cell phone camera to capture image
9.  sort dishes by name, venue, distance
10. sort distance handle by geoNear

# node_modules

1. express
2. bcrypt
3. gm
4. mongodb
5. mongoose
6. underscore

# Usage
  sudo service mongod start   // run mongo server at localhost
  node/nodejs app.js     // runserver in localhost:8080
  
