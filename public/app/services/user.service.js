(function(){
'use strict';
	angular.module('userServices',[])
	.factory('User',function($http){
		var userService={};
		    userService.create = function(regData){
		    	return $http.post('/api/users', regData); 
		    };

		    userService.checkEmail = function(regData) {
		        return $http.post('/api/checkemail', regData);
		    };

		    userService.checkUsername = function(regData) {
		        return $http.post('/api/checkusername', regData);
		    };
		    
		    userService.activateAccount = function(token) {
		        return $http.put('/api/activate/' + token);
		    };

		    userService.getPermission = function() {
		        return $http.get('/api/permission');
		    };

		    return userService;

	})

})();