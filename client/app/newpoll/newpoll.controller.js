'use strict';

angular.module('polltasticApp')
  .controller('NewpollCtrl', function ($scope, $http, User, Auth) {
    $scope.awesomeThings = [];
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.placeHolders = ["Pepsi","Coca Cola"];
    $scope.counter = 0;
    $scope.choices=["",""]

    $scope.addChoice = function(){
      $scope.counter++;
      $scope.placeHolders.push("New Choice " + $scope.counter);
      $scope.choices.push("");
    }
    $scope.removeChoice = function(index){
      $scope.placeHolders[index]=null;
      $scope.placeHolders=$scope.placeHolders.filter(function(item){return item !==null});
    }
    $scope.addPoll = function(){
      $scope.createdTime = new Date();
      if ($scope.pollTitle!=="") {
        if ($scope.choices.length>=2) {
          var poll = {
            title: $scope.pollTitle,
            choices: $scope.choices.map(function(item){return {name: item, votes: 0}}),
            ownerid: $scope.getCurrentUser()._id,
            owner: $scope.getCurrentUser().name,
            voted:[],
            created: $scope.createdTime.getTime()
          }
          $http.post('/api/polls', poll).success(function(){
            $scope.placeHolders = ["Pepsi","Coca Cola"];
            $scope.pollTitle="";
            $scope.choices=[];
            $scope.counter=0;
          })
        }

      }

    }


    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
  });
