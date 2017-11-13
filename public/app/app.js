(function() {
 'use strict';
 
	angular.module('userApp', ['appRoutes','userControllers','userServices','emailController','mainController','authServices'])

	.config(function($httpProvider) {
	    $httpProvider.interceptors.push('AuthInterceptors');
	});

})();