(function() {
 'use strict';
 
    angular.module('emailController', ['userServices'])
  
    .controller('activateController', function($stateParams, User, $timeout, $location) {
        var app = this;
        User.activateAccount($stateParams.token).then(function(data) {
            app.errorMsg = false; 
            if (data.data.success) {
                app.successMsg = data.data.message + '...Redirecting'; 
                $timeout(function() {
                    $location.path('/login');
                }, 2000);
            } else {
                app.errorMsg = data.data.message + '...Redirecting'; 
                $timeout(function() {
                    $location.path('/login');
                }, 2000);
            }
        });
    });


})();