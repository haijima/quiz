'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ui.bootstrap'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');


    $stateProvider
      .state('admin', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        authenticate: true
      }).state('about', {
        url: '/about',
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      }).state('adminQuestion', {
        url: '/admin/question/:eventId',
        templateUrl: 'views/admin.question.html',
        controller: 'AdminQuestionCtrl',
        authenticate: true
      }).state('user', {
        url: '/admin/user',
        templateUrl: 'views/admin.user.html',
        controller: 'AdminUserCtrl',
        authenticate: true
      }).state('event', {
        url: '/admin/event/:id',
        templateUrl: 'views/admin.event.html',
        controller: 'AdminEventCtrl',
        authenticate: true
      }).state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      }).state('signup', {
        url: '/signup',
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      }).state('userLogin', {
        url: '/user/login/:eventId',
        templateUrl: 'views/user.login.html',
        controller: 'UserLoginCtrl'
      }).state('userQuestion', {
        url: '/user/question',
        templateUrl: 'views/user.question.html',
        controller: 'UserQuestionCtrl'
      }).state('userAnswer', {
        url: '/user/answer',
        templateUrl: 'views/user.answer.html',
        controller: 'UserAnswerCtrl'
      }).state('setting', {
        url: '/account/setting',
        templateUrl: 'views/settings.html',
        controller: 'SettingCtrl'
      });

  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          console.log('interceptor');
          console.log();
          // APIの返り値が401の場合を一旦escapeしている
          if(!/.*json.*/.test(response.config.headers.Accept)){
            $location.path('/login');
          }
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        } else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        console.log('isLoggedInAsync callback: loggedIn='+loggedIn);
        console.log('next.authenticate: '+next.authenticate);
        if (next.authenticate && !loggedIn) {
          console.log('redirect!');
          $location.path('/login');
        }
      });
    });
  })

  .constant('API_DOMAIN', 'http://ec2-54-64-240-244.ap-northeast-1.compute.amazonaws.com/api/');
