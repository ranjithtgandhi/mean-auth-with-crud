(function(){
'use strict';
	angular.module('authServices', [])
	.factory('Auth', function($http, AuthToken) {
	    var authService = {}; 
	    authService.login = function(loginData) {
	        return $http.post('/api/authenticate', loginData).then(function(data) { debugger;
	            AuthToken.setToken(data.data.token); 
	            return data;
	        });
	    };

	    authService.isLoggedIn = function() {
	        if (AuthToken.getToken()) {
	            return true; 
	        } else {
	            return false; 
	        }
	    };

	    authService.socialMedia = function(token) {
	        AuthToken.setToken(token);
	    };

	    authService.getUser = function() {
	        if (AuthToken.getToken()) {
	            return $http.post('/api/me');
	        } else {
	            $q.reject({ message: 'User has no token' }); 
	        }
	    };

	    authService.logout = function() {
	        AuthToken.setToken(); 
	    };

	    return authService; 
	})

	.factory('AuthToken', function($window) {
	    var authTokenService = {}; 
	    authTokenService.setToken = function(token) {
	        if (token) {
	            $window.localStorage.setItem('token', token); 
	        } else {
	            $window.localStorage.removeItem('token'); 
	        }
	    };
	    authTokenService.getToken = function() {
	        return $window.localStorage.getItem('token');
	    };

	    return authTokenService; 
	})

	.factory('AuthInterceptors', function(AuthToken) {
	    var authInterceptorsFactory = {};
	    authInterceptorsFactory.request = function(config) {
	        var token = AuthToken.getToken();
	        if (token) config.headers['x-access-token'] = token;

	        return config;
	    };

	    return authInterceptorsFactory; 

	});


})();