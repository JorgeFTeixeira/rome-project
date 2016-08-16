var app = angular.module('romeApp', ['ngRoute', 'ngResource']).run(function($rootScope) {
  $rootScope.authenticated = false;
  $rootScope.current_user = '';
  
  $rootScope.signout = function(){
    $http.get('auth/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = '';
  };
});

app.config(function($routeProvider){
  $routeProvider
    //the timeline display
    .when('/', {
      templateUrl: 'main.html',
      controller: 'mainController'
    })
    //the login display
    .when('/login', {
      templateUrl: 'login.html',
      controller: 'authController'
    })
    //the signup display
    .when('/signup', {
      templateUrl: 'register.html',
      controller: 'authController'
    });
});

app.factory('factoryService', function($resource){
  return $resource('/api/balance/:id');
});

app.controller('mainController', function($rootScope, $scope, factoryService){
  $scope.inputs = factoryService.query();
	$scope.newInput = {created_by: '', value: '', text: '', created_at: ''};

	$scope.addInput = function(){
    $scope.newInput.created_by = $rootScope.current_user;
    $scope.newInput.created_at = Date.now();
    factoryService.save($scope.newInput, function(){
      $scope.inputs = factoryService.query();
      $scope.newInput = {created_by: '', value: '', text: '', created_at: ''};
    });
	};
});

app.controller('authController', function($scope, $http, $rootScope, $location){
  $scope.user = {username: '', password: ''};
  $scope.error_message = '';
  
  $scope.login = function(){
    $http.post('/auth/login', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };

  $scope.register = function(){
    $http.post('/auth/signup', $scope.user).success(function(data){
      if(data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      }
      else{
        $scope.error_message = data.message;
      }
    });
  };
});