'use strict';

angular.module('polltasticApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/newpoll', {
        templateUrl: 'app/newpoll/newpoll.html',
        controller: 'NewpollCtrl',
        authenticate: true
      });
  });
