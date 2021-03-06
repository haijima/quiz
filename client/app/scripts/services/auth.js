'use strict';

angular.module('clientApp')
  .factory('Auth', function Auth($location, $rootScope, $http, User, $cookieStore, $q, API_DOMAIN) {
    var currentUser = {};
    if($cookieStore.get('token')) {
      // currentUser = User.get();
      currentUser.id = $cookieStore.get('token');
    }

    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post(API_DOMAIN+'admin_users/sign_in', {
          'admin_user': {
            'email': user.email,
            'password': user.password,
            'password_confirmation': user.password,
            'remember_me': '0'
          },
          'commit': 'Log in'
        }).
        success(function(data) {
          console.log(data);
          // $cookieStore.put('token', data.auth_token);
          $cookieStore.put('token', data.admin_user.id);
          // currentUser = User.get();
          currentUser = data.admin_user;
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          this.logout();
          console.log(err);
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },
       /**
       * Authenticate customer
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      userLogin: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();
        $cookieStore.remove('answerer');
        $cookieStore.put('answerer', user.name);
        $http.post(API_DOMAIN + 'answerers/', 
        {
          'name':user.name,
          'event_id':user.id,
        }
      ).
        success(function(data) {
          console.log(data);
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          console.log(err);
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },


      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookieStore.remove('token');
        currentUser = {};
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function(user, callback) {
        var cb = callback || angular.noop;

        // return User.save(user,
        return User.signup({}, {
          'admin_user': {
            'email': user.email,
            'password': user.password,
            'password_confirmation': user.password,
            'remember_me': '0'
          },
          'commit': 'Sign up'
        }, function(data) {
            console.log(data);
            $cookieStore.put('token', data.token);
            // currentUser = User.get();
            currentUser = data.admin_user;
            return cb(user);
          },
          function(err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function(oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return currentUser;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty('role');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        console.log('isLoggedInAsync');
        console.log('currentUser:');
        console.log(currentUser);
        if(currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentUser.hasOwnProperty('id')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return currentUser.role === 'admin';
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  });
