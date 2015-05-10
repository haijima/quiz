'use strict';

angular.module('clientApp')
.controller('UserLoginCtrl', function ($rootScope, $scope, $location, $stateParams, Auth,events) {
  $scope.user = {};
  $scope.errors = {};
  $scope.id = $stateParams.eventId;

  events.checkToken({id: $scope.id}, function(data){
    console.log(data);
    $scope.eventId = data.id;
  },function(error){
    console.log(error);
    $rootScope.$broadcast('error-message', {message: error.data.info});
  });

  $scope.login = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
      Auth.userLogin({
        name: $scope.user.name,
        id:$scope.eventId,
      })
      .then( function() {
        console.log('login success');
        // Logged in, redirect to home
        $location.path('/user/question/0');
      })
      .catch( function(err) {
        console.log(err);
        $scope.errors.other = err;
        $rootScope.$broadcast('error-message', {message: err.info});
      });
    }
  };
});


