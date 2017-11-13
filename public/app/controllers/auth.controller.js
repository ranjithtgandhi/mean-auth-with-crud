(function() {
 'use strict';
    angular.module('mainController', ['authServices', 'userServices'])

    .controller('mainCtrl', function(Auth, $timeout, $location, $rootScope, $window, $interval, User, AuthToken, $scope) {
        
        var app = this;
        app.loadme = false;
        if ($window.location.pathname === '/') app.home = true; 

        if (Auth.isLoggedIn()) {
            Auth.getUser().then(function(data) {
                if (data.data.username === undefined) {
                    Auth.logout();
                    app.isLoggedIn = false;
                    $location.path('/');
                    app.loadme = true;
                }
            });
        }

        this.doLogin = function(loginData) {
            app.loading = true; 
            app.errorMsg = false; 
            app.expired = false; 
            app.disabled = true; 
            $scope.alert = 'default'; 
            
            Auth.login(app.loginData).then(function(data) { 
                if (data.data.success) {
                    app.loading = false; 
                    $scope.alert = 'alert alert-success';
                    app.successMsg = data.data.message + '...Redirecting'; 
                    $timeout(function() {
                        $location.path('/'); 
                        app.loginData = ''; 
                        app.successMsg = false; 
                        app.disabled = false; 
                        app.checkSession(); 
                    }, 2000);
                } else {

                    if (data.data.expired) {
                        app.expired = true; 
                        app.loading = false; 
                        $scope.alert = 'alert alert-danger'; 
                        app.errorMsg = data.data.message; 
                    } else {
                        app.loading = false; 
                        app.disabled = false; 
                        $scope.alert = 'alert alert-danger'; 
                        app.errorMsg = data.data.message; 
                    }
                }
            });

        };


        app.checkSession = function() {
            if (Auth.isLoggedIn()) {
                app.checkingSession = true; 
                var interval = $interval(function() {
                    var token = $window.localStorage.getItem('token');
                    if (token === null) {
                        $interval.cancel(interval);
                    } else {
                        self.parseJwt = function(token) {
                            var base64Url = token.split('.')[1];
                            var base64 = base64Url.replace('-', '+').replace('_', '/');
                            return JSON.parse($window.atob(base64));
                        };
                        var expireTime = self.parseJwt(token); 
                        var timeStamp = Math.floor(Date.now() / 1000); 
                        var timeCheck = expireTime.exp - timeStamp; 
                        if (timeCheck <= 1800) {
                            showModal(1); 
                            $interval.cancel(interval); 
                        }
                    }
                }, 30000);
            }
        };
        app.checkSession(); 

        $rootScope.$on('$stateChangeStart', function() {
            if (!app.checkingSession) app.checkSession();
            if (Auth.isLoggedIn()) {
                Auth.getUser().then(function(data) {
                    if (data.data.username === undefined) {
                        app.isLoggedIn = false; 
                        Auth.logout();
                        app.isLoggedIn = false;
                        $location.path('/');
                    } else {
                        app.isLoggedIn = true; 
                        app.username = data.data.username; 
                        //checkLoginStatus = data.data.username;
                        app.useremail = data.data.email; 
                        User.getPermission().then(function(data) {
                            if (data.data.permission === 'admin' || data.data.permission === 'moderator') {
                                app.authorized = true; 
                                app.loadme = true; 
                            } else {
                                app.authorized = false;
                                app.loadme = true; 
                            }
                        });
                    }
                });
            } else {
                app.isLoggedIn = false; 
                app.username = ''; 
                app.loadme = true; 
            }
            if ($location.hash() == '_=_') $location.hash(null); 
            app.disabled = false; 
            app.errorMsg = false; 

        });

        var showModal = function(option) {
            app.choiceMade = false; // Clear choiceMade on startup
            app.modalHeader = undefined; // Clear modalHeader on startup
            app.modalBody = undefined; // Clear modalBody on startup
            app.hideButton = false; // Clear hideButton on startup

            // Check which modal option to activate (option 1: session expired or about to expire; option 2: log the user out)      
            if (option === 1) {
                app.modalHeader = 'Timeout Warning'; // Set header
                app.modalBody = 'Your session will expired in 30 minutes. Would you like to renew your session?'; // Set body
                $("#myModal").modal({ backdrop: "static" }); // Open modal
                // Give user 10 seconds to make a decision 'yes'/'no'
                $timeout(function() {
                    if (!app.choiceMade) app.endSession(); // If no choice is made after 10 seconds, select 'no' for them
                }, 10000);
            } else if (option === 2) {
                app.hideButton = true; // Hide 'yes'/'no' buttons
                app.modalHeader = 'Logging Out'; // Set header
                $("#myModal").modal({ backdrop: "static" }); // Open modal
                // After 1000 milliseconds (2 seconds), hide modal and log user out
                $timeout(function() {
                    Auth.logout(); // Logout user
                    $location.path('/logout'); // Change route to clear user object
                    hideModal(); // Close modal
                }, 2000);
            }
        };

        app.endSession = function() {
            app.choiceMade = true; // Set to true to stop 10-second check in option 1
            hideModal(); // Hide modal
            // After 1 second, activate modal option 2 (log out)
            $timeout(function() {
                showModal(2); // logout user
            }, 1000);
        };

        // Function to hide the modal
        var hideModal = function() {
            $("#myModal").modal('hide'); // Hide modal once criteria met
        };

        app.logout = function() {
            showModal(2); 
        };






    });



})();