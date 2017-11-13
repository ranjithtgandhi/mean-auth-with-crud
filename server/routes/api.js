var User = require('../models/user'); 
var jwt = require('jsonwebtoken');
var secret = 'harrypotter'; 
var nodemailer = require('nodemailer'); 
    //router = express.Router();
 
var transport = nodemailer.createTransport( {
	    service: 'Hotmail',
	    auth: {
	        user: "node.esender@hotmail.com",
	        pass: "node@123"
	    }
	});
    
    transport.verify(function(error, success) {
       if (error) {
            console.log(error);
       } else {
            console.log('Server is ready to take our messages');
       }
    });
 
//add here other api routes
 
module.exports = function(router) {

	router.post('/checkemail',checkEmail);
    router.post('/checkusername',checkUsername);
    router.post('/users', userRegister);
    router.put('/activate/:token', activateToken);
    router.post('/authenticate', userLogin);
    

    router.use(function(req, res, next) {
        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if (token) { alert(token);
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.json({ success: false, message: 'Token invalid' }); 
                } else {
                    req.decoded = decoded; 
                    next(); 
                }
            });
        } else {
            res.json({ success: false, message: 'No token provided' });
        }
    });

   
    router.post('/me', function(req, res) {
        res.send(req.decoded); 
    });

    router.get('/permission', function(req, res) {
        User.findOne({ username: req.decoded.username }, function(err, user) {
            if (err) {                
                res.json({ success: false, message: 'Something went wrong.' });
            } else {
                if (!user) {
                    res.json({ success: false, message: 'No user was found' });
                } else {
                    res.json({ success: true, permission: user.permission }); 
                }
            }
        });
    });
    
    

	function checkEmail(req,res){
		User.findOne({ email: req.body.email }).select('email').exec(function(err, user) {
            if (err) {
            	/*var mailOptions = {
						from: "node.esender@hotmail.com",
						to: "ranjithzen@gmail.com",
						subject: 'Error Logged',
						text: 'The following error has been reported in the MEAN Stack Application: ' + err,
						generateTextFromHTML: true,
						html: '<b>The following error has been reported in the MEAN Stack Application:</b><br><br>' + err
				};
            	
                transport.sendMail(mailOptions, function(err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(info);  
                    }
                });
                transport.verify(function(error, success) {
                   if (error) {
                        console.log(error);
                   } else {
                        console.log('Server is ready to take our messages');
                   }
                });*/
                res.json({ success: false, message: 'Something went wrong.' });
            } else {
                if (user) {                	
                    res.json({ success: false, message:  'That email address is already taken. Please Try another.' });
                } else {
                    res.json({ success: true, message: req.body.email }); 
                }
            }
        });
	}

    function checkUsername(req, res) {
        User.findOne({ username: req.body.username }).select('username').exec(function(err, user) {
            if (err) {
                /*var mailOptions = {
                        from: "node.esender@hotmail.com",
                        to: "ranjithzen@gmail.com",
                        subject: 'Error Logged',
                        generateTextFromHTML: true,
                        text: 'The following error has been reported in the MEAN Auth Application: ' + err,                       
                        html: '<b>The following error has been reported in the MEAN Auth Application:</b><br><br>' + err
                };                
                transport.sendMail(mailOptions, function(err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(info);  
                    }
                });
                transport.verify(function(error, success) {
                   if (error) {
                        console.log(error);
                   } else {
                        console.log('Server is ready to take our messages');
                   }
                });*/
                res.json({ success: false, message: 'Something went wrong.' });
            } else {
                if (user) {
                    res.json({ success: false, message: 'That username is already taken. Please Try another.' }); 
                } else {
                    res.json({ success: true, message: req.body.username });
                }
            }
        });
    }

   function userRegister(req, res) {
        var user = new User(); 
        user.username = req.body.username; 
        user.password = req.body.password; 
        user.email = req.body.email; 
        user.name = req.body.name; 
        user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); 
        //console.log(user.temporarytoken);
        if (req.body.username === null || req.body.username === '' || req.body.password === null || req.body.password === '' || req.body.email === null || req.body.email === '' || req.body.name === null || req.body.name === '') {
            res.json({ success: false, message: 'Ensure username, email, and password were provided' });
        } else {
             user.save(function(err) {
                if (err) {
                    if (err.errors !== null) {
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message }); 
                        } else if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message }); 
                        } else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message }); 
                        } else if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message }); 
                        } else {
                            res.json({ success: false, message: err }); 
                        }
                    } else if (err) {
                        if (err.code == 11000) {
                            if (err.errmsg[61] == "u") {
                                res.json({ success: false, message: 'Your username is already taken' }); 
                            } else if (err.errmsg[61] == "e") {
                                res.json({ success: false, message: 'Your e-mail is already taken' }); 
                            }
                        } else {
                            res.json({ success: false, message: err });
                        }
                    }
                } else {

                    var mailOptions = {
                        from: "node.esender@hotmail.com",
                        to: "ranjithzen@gmail.com",
                        subject: 'Your Activation Link',
                        generateTextFromHTML: true,
                        html: 'Hello <strong> ' + user.name + '</strong>,<br><br>Thank you for registering at localhost.com. Please click on the link below to complete your activation:<br><br><a href="http://localhost:3000/activate/' + user.temporarytoken + '">http://localhost:3000/activate/</a>'
                    };                
                    transport.sendMail(mailOptions, function(error, response) {
                      if (error) {
                        console.log(error);
                      } else {
                        console.log(response);
                      }
                      transport.close();
                    });
                    transport.verify(function(error, success) {
                       if (error) {
                            console.log(error);
                       } else {
                            console.log('Server is ready to take our messages');
                       }
                    });

                    res.json({ success: true, message: 'Account registered! Please check your e-mail for activation link.' }); // Send success message back to controller/request
                }
            });
        }
    }

    function activateToken(req, res){
        User.findOne({ temporarytoken: req.params.token }, function(err, user) {
            if (err) {
               /* var mailOptions = {
                        from: "node.esender@hotmail.com",
                        to: "ranjithzen@gmail.com",
                        subject: 'Error Logged',
                        generateTextFromHTML: true,
                        html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                    };                
                    transport.sendMail(mailOptions, function(error, response) {
                      if (error) {
                        console.log(error);
                      } else {
                        console.log(response);
                      }
                      transport.close();
                    });
                    transport.verify(function(error, success) {
                       if (error) {
                            console.log(error);
                       } else {
                            console.log('Server is ready to take our messages');
                       }
                    });*/

                res.json({ success: false, message: 'Something went wrong.' });
            } else {
                var token = req.params.token; 
                jwt.verify(token, secret, function(err, decoded) {
                    if (err) {
                        res.json({ success: false, message: 'Activation link has expired.' }); 
                    } else if (!user) {
                        res.json({ success: false, message: 'Activation link has expired.' }); 
                    } else {
                        user.temporarytoken = false; 
                        user.active = true; 
                        user.save(function(err) {
                            if (err) {
                                console.log(err);
                            } else {
                                /*var mailOptions = {
                                        from: "node.esender@hotmail.com",
                                        to: user.email,
                                        subject: 'Account Activated',
                                        generateTextFromHTML: true,                                        
                                        html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Your account has been successfully activated!'
                                    };                
                                    transport.sendMail(mailOptions, function(error, response) {
                                      if (error) {
                                        console.log(error);
                                      } else {
                                        console.log(response);
                                      }
                                      transport.close();
                                    });
                                    transport.verify(function(error, success) {
                                       if (error) {
                                            console.log(error);
                                       } else {
                                            console.log('Server is ready to take our messages');
                                       }
                                    }); */                               
                                res.json({ success: true, message: 'Account activated!' });
                            }
                        });
                    }
                });
            }
        });

    }

    function userLogin(req,res){
        var loginUser = (req.body.username).toLowerCase(); 
        User.findOne({ username: loginUser }).select('email username password active').exec(function(err, user) {
            if (err) {
                /*// Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
                var email = {
                    from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                    to: 'gugui3z24@gmail.com',
                    subject: 'Error Logged',
                    text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                    html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
                };
                // Function to send e-mail to myself
                client.sendMail(email, function(err, info) {
                    if (err) {
                        console.log(err); // If error with sending e-mail, log to console/terminal
                    } else {
                        console.log(info); // Log success message to console if sent
                        console.log(user.email); // Display e-mail that it was sent to
                    }
                });*/
                res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
            } else { 
                if (!user) {
                    res.json({ success: false, message: 'Username not found' });
                } else if (user) {
                    if (!req.body.password) {
                        res.json({ success: false, message: 'No password provided' });
                    } else {
                        var validPassword = user.comparePassword(req.body.password); 
                        if (!validPassword) {
                            res.json({ success: false, message: 'Could not authenticate password' }); 
                        } else if (!user.active) {
                            res.json({ success: false, message: 'Account is not yet activated. Please check your e-mail for activation link.', expired: true }); // Account is not activated 
                        } else {
                            var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' }); 
                            res.json({ success: true, message: 'User authenticated!', token: token });
                        }
                    }
                }
            }
        });
    }
	
    


	return router;

};