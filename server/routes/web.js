var express = require('express'),
 router = express.Router(),
 path = require("path");
 
var absPath = path.join(__dirname, "../../public/app");
router.get('*', function(req, res, next) {
 res.sendFile(absPath + "/app.html");
}); 

 
module.exports = router;