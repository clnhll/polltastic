'use strict';

angular.module('polltasticApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/all', {
        templateUrl: 'app/all/all.html',
        controller: 'AllCtrl',
      });
  });
