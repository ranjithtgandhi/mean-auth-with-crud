(function() {
 'use strict';

 	angular.module('userControllers',['userServices'])
 	.controller('regController',function($http, $location, $timeout, User, $scope,$rootScope, $state, $stateParams){
 		var regScope = this;
 		if ($state.current.name == "signup") {
 			regScope.Title = "SIGN UP";
 		}
		
		this.regUsermsg = function () {
			regScope.emailMsg = false;	
			regScope.usernameMsg = false;			
		};	
		
 		this.regUser = function(regData,valid) {
 			console.log('regData'+regData);
	        regScope.disabled = true; 
	        regScope.loading = true; 
	        regScope.errorMsg = false; 

	        if (valid) {
	            regScope.regData.name = regScope.regData.firstName + " " + regScope.regData.lastName; 
	            
	            User.create(regScope.regData).then(function(res) {
	                if (res.data.success) {
	                    regScope.loading = false; 
	                    $scope.alert = 'alert alert-success'; 
	                    regScope.successMsg = res.data.message + '...Redirecting'; 
	                    $timeout(function() {
	                        $location.path('/login');
	                    }, 2000);
	                } else {
	                    regScope.loading = false; 
	                    regScope.disabled = false; 
	                    $scope.alert = 'alert alert-danger'; 
	                    regScope.errorMsg = res.data.message; 
	                }
	            });
	            
	        } else {
	            regScope.disabled = false; 
	            regScope.loading = false; 
	            $scope.alert = 'alert alert-danger'; 
	            regScope.errorMsg = 'Please fill all the required fields...'; 
	        }


 		};
 		this.checkEmail = function(regData) {
	        regScope.checkingEmail = true; 
	        regScope.emailMsg = false; 
	        regScope.emailInvalid = false; 

	        User.checkEmail(regScope.regData).then(function(res) {	           
	            if (res.data.success) {
	                regScope.checkingEmail = false; 	                
	                if(res.data.message){
	                	regScope.emailMsg = '\"'+res.data.message+'\"' + '  is available'	
	                }  
	            } else {
	                regScope.checkingEmail = false; 
	                regScope.emailInvalid = true; 
	                regScope.emailMsg = res.data.message; 
	            }
	        });
	    };
	    this.checkUsername = function(regData) {
	        regScope.checkingUsername = true; 
	        regScope.usernameMsg = false; 
	        regScope.usernameInvalid = false; 

	         User.checkUsername(regScope.regData).then(function(data) {
	            if (data.data.success) {
	                regScope.checkingUsername = false;
	                if(data.data.message){
	                	regScope.usernameMsg = '\"'+data.data.message+'\"' + '  is available'	
	                } 	                 
	            } else {
	                regScope.checkingUsername = false; 
	                regScope.usernameInvalid = true; 
	                regScope.usernameMsg = data.data.message;
	            }
	        });
	    };


 	})
 	.directive('match', function() {
	    return {
	        restrict: 'A', 
	        controller: function($scope) {
	            $scope.confirmed = false;           
	            $scope.doConfirm = function(values) {
	            	   if ($scope.cpassword == values[0]) {
	                        $scope.confirmed = true; 
	                    } else {
	                        $scope.confirmed = false;
	                    }
	                /*values.forEach(function(ele) {
	                    if ($scope.cpassword == ele) {
	                        $scope.confirmed = true; 
	                    } else {
	                        $scope.confirmed = false;
	                    }
	                });*/
	            };
	        },

	        link: function(scope, element, attrs) {         
	            attrs.$observe('match', function() {
	                scope.matches = JSON.parse(attrs.match); 
	                scope.doConfirm(scope.matches); 
	            });      
	            scope.$watch('cpassword', function() {
	                scope.matches = JSON.parse(attrs.match); 
	                scope.doConfirm(scope.matches); 
	            });
	        }
	    };
	});

})();