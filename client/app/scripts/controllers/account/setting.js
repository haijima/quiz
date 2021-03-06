'use strict';

angular.module('clientApp')
.controller('SettingCtrl', function ($scope, User, Auth, $location) {
  $scope.errors = {};

  $scope.changePassword = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
      Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
      .then( function() {
        $scope.message = 'Password successfully changed.';
      })
      .catch( function() {
        form.password.$setValidity('mongoose', false);
        $scope.errors.other = 'Incorrect password';
        $scope.message = '';
      });
    }
  };

  $scope.logout = function() {
    Auth.logout();
    $location.path('/login');
  };

});
