var mongoose = require('mongoose'); 
var connection = mongoose.connect('mongodb://localhost:27017/meanstack-auth-bootstrap', function(err) {
	    if (err) {
	        console.log('Not connected to the database: ' + err); 
	    } else {
	        console.log('Successfully connected to MongoDB'); 
	    }
	});
module.exports = connection;
	/*mongoose.Promise = global.Promise;
var connection = mongoose.connect('mongodb://localhost:27017/mean_crud');*/
 
