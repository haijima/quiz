'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:QuestionCtrl
 * @description
 * # userQuestionCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('UserResultCtrl', function ($rootScope, $scope, $stateParams, answerers, $location,$cookieStore,answer) {

    $rootScope.noHeader = true;
    $scope.name = $cookieStore.get('anwerer');
    $scope.result = true;

    $scope.result = function(){
      answerers.answerersResult({},function(data){
      console.log(data);
      if (data.rank == null) {
        $rootScope.$broadcast('show-message', {message: '司会者の指示をお待ちください。',type: 'danger'});
      } else {
        $rootScope.$broadcast('hide-message', {message: '司会者の指示をお待ちください。'});
        $scope.result = false;
        $scope.rank = data.rank;
      }
    },function(error){
      console.log(error);
    });
    
    }
});


