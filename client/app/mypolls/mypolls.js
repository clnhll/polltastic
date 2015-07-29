'use strict';

angular.module('polltasticApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/mypolls', {
        templateUrl: 'app/mypolls/mypolls.html',
        controller: 'MypollsCtrl',
        authenticate: true
      });
  });
