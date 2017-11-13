var express = require('express'); 
var app = express(); 
var expressEjsLayouts = require('express-ejs-layouts');
var port = process.env.PORT || 3000;
var morgan = require('morgan'); 
var connection = require("./server/config/db");
var bodyParser = require('body-parser'); 
var router = express.Router(); 
var apiRoutes = require('./server/routes/api')(router);
var routes = require('./server/routes/web'); //web routes 
var path = require('path'); 
var passport = require('passport'); 
//var social = require('./server/passport/passport')(app, passport); 


app.use(morgan('dev'));
//app.set('views', './public/app');
app.set('view engine', 'ejs');
//app.set('layout', 'layout');
//app.use(expressEjsLayouts);

// parse application/json 
app.use(bodyParser.json());
 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 
 
// setting static files location './app' for angular app html and js
app.use(express.static(__dirname + '/public'));
//app.use(express.static(__dirname + '/app'));//app.use(express.static(path.join(__dirname, 'app')));
// setting static files location './node_modules' for libs like angular, bootstrap
app.use(express.static('node_modules'));



// configure our routes
app.use('/', routes);
app.use('/api', apiRoutes);


// starting express server
app.listen(port, function() {
	console.log("Server is running at : http://localhost:" + port);
});