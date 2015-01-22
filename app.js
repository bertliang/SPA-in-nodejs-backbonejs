// app.js Node.js server

"use strict;"   // flag JS errors 

/* Module dependencies:
 *
 * require() loads a nodejs "module" - basically a file.  Anything
 * exported from that file (with "exports") can now be dotted off
 * the value returned by require(), in this case e.g. eatz.api
 * The convention is use the same name for variable and module.
 */
var http = require("https"),   // ADD CODE
    // NOTE, use the version of "express" linked to the assignment handout
    express = require("express"), // Express Web framework   ... ADD CODE
    fs = require("fs"),
    // config is just an object, that defines attributes such as "port"
    config = require("./config"),  // app's local config - port#, etc
    eatz = require('./routes/eatz');  // route handlers   ... ADD CODE

var app = express();  // Create Express app server

// Configure app server
app.configure(function() {
    // use PORT environment variable, or local config file value
    app.set('port', process.env.PORT || config.port);
    //console.log(app.get('port'));

    // change param value to control level of logging  ... ADD CODE
    app.use(express.logger('dev'));  // 'default', 'short', 'tiny', 'dev'

    // use compression (gzip) to reduce size of HTTP responses
    app.use(express.compress());

    // parses HTTP request-body and populates req.body
    app.use(express.bodyParser({
        uploadDir: __dirname + '/public/img/uploads',
        keepExtensions: true
    }));

    // Perform route lookup based on URL and HTTP method,
    // Put app.router before express.static so that any explicit
    // app.get/post/put/delete request is called before stati

    // session config
    app.use(express.cookieParser());           // populates req.signedCookies
    app.use(express.session({key: config.sessionKey,
        secret: config.sessionSecret,
        cookie: {maxAge:config.sessionTimeout} }));
    app.use(app.router);
    // location of app's static content ... may need to ADD CODE
    app.use('/public', express.static(__dirname + "/public"));
    // return error details to client - use only during development

    app.use(express.errorHandler({ dumpExceptions:true, showStack:true }));

});


// App routes (API) - route-handlers implemented in routes/eatz.js

// Heartbeat test of server API
app.get('/', eatz.api);

// Retrieve a single dish by its id attribute
app.get('/dishes/:id', eatz.getDish);

// Upload an image file and perform image processing on it
app.post('/dishes/image', eatz.uploadImage);

// ADD CODE to support other routes listed on assignment handout
app.get('/dishes', eatz.getDishes);

app.post('/dishes', eatz.addDish);

app.put('/dishes/:id', eatz.editDish);

app.delete('/dishes/:id', eatz.deleteDish);

app.get('/auth', eatz.isAuth);

app.post('/auth', eatz.signup);

app.put('/auth', eatz.auth);

// use RSA private key and public key
var option = {
    key : fs.readFileSync('key.pem'),  // RSA private key
    cert : fs.readFileSync('cert.pem')  // RSA public key
}


// Start HTTPS server, use RSA private key and public key
http.createServer(option, app).listen(app.get('port'), process.env.IP, function () {
    console.log("Express server listening on port %d in %s mode",
    		app.get('port'), config.env );
});
