(function() {
 'use strict';
 
	var app = angular.module('appRoutes', ['ui.router'])//ngRoute
	.config(function($stateProvider, $urlRouterProvider,$locationProvider) {
		
		$urlRouterProvider.otherwise("/");

		$stateProvider           
	    .state('home', {
	    	url:'/',
	        templateUrl: 'app/views/home.html'
	    })
	    .state('signin', {
	    	url:'/login',
	        templateUrl: 'app/views/login.html',
	        authenticated: false
	    })
	    .state('signup', {
	    	url:'/register',
	        templateUrl: 'app/views/register.html',
	        controller: 'regController',
	        controllerAs: 'register',
	        authenticated: false
	    })
	    .state('activate', {
	    	url:'/activate/:token',
	        templateUrl: 'app/views/auth/activate.html',
	        controller: 'activateController',
	        controllerAs: 'activate',
	        authenticated: false
	    })
	    .state('profile', {
	    	url:'/profile',
	        templateUrl: 'app/views/user/profile.html',
	        authenticated: true
	    })
	    .state('about', {
	    	url:'/about',
	        templateUrl: 'app/views/about.html'
	    })
	    //.otherwise({ redirectTo: '/' }); 

	    $locationProvider.html5Mode({ enabled: true, requireBase: false });
	})
	.run(function($rootScope, Auth, $location, User,$state) {
		$rootScope.$on('$stateChangeStart', function(event, next, current) {
	        if (next.name !== undefined) {
	            if (next.authenticated === true) {
	                if (!Auth.isLoggedIn()) {
	                    event.preventDefault(); 
	                    $state.go('home'); 
	                } else if (next.$$state.permission) {
	                    User.getPermission().then(function(data) {
	                        if (next.permission[0] !== data.data.permission) {
	                            if (next.permission[1] !== data.data.permission) {
	                                event.preventDefault(); 
	                                $state.go('home'); 
	                            }
	                        }
	                    });
	                }
	            } else if (next.authenticated === false) {
	                if (Auth.isLoggedIn()) {
	                    event.preventDefault(); 
	                    $state.go('profile')
	                }
	            }
	        }
	    });

	});
	/*.constant("globalConfig", {
	 	apiAddress: 'http://localhost:3000/api',
	 	hostAddress: 'http://localhost:3000'
	});*/

})();