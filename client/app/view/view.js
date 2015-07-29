'use strict';

angular.module('polltasticApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/:user/:pollid', {
        templateUrl: 'app/view/view.html',
        controller: 'ViewCtrl',
      });
  });
