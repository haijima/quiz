'use strict';

/**
 * @ngdoc service
 * @name clientApp.answerers
 * @description
 * # answerers
 * Service in the clientApp.
 */
angular.module('clientApp')
 .service('answerers', function ($resource, API_DOMAIN) {

   return $resource(API_DOMAIN + 'answerers/:controller/:id',
   {
     controller:'',
     id: ''
   },
   {
     answerersQuestions: {
       method: 'GET',
       params: {
         controller:'get_question'
       }
      },
      answerersResult: {
       method: 'GET',
       params: {
         controller:'show'
       }
      }

   });
});


