'use strict';

angular.module('polltasticApp')
  .controller('ViewCtrl', function ($scope, $http, User, Auth, $routeParams) {
    $scope.awesomeThings = [];
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.isLoggedIn = Auth.isLoggedIn;

    var user = $routeParams.user;
    var pollid = $routeParams.pollid;
    $scope.formData={};

    $http.get('/api/polls/'+ pollid).success(function(poll){
      $scope.poll=poll;
      $scope.runChart();
    });

    $scope.vote = function(){
      if ($scope.poll.voted.indexOf($scope.getCurrentUser()._id) == -1 && $scope.formData.selection!==undefined && $scope.isLoggedIn()) {
        console.log($scope.poll.voted)

        $scope.poll.voted.push($scope.getCurrentUser()._id);
        $scope.poll.choices[$scope.formData.selection].votes++;
        console.log($scope.poll.voted)
        $http.delete('/api/polls/' + $scope.poll._id).success(function(){
          $http.post('/api/polls',$scope.poll).success(function(poll){
              $scope.poll=poll;
              console.log("you voted for " + $scope.poll.choices[$scope.formData.selection].name);
              console.log($scope.poll.voted)

              $scope.runChart();



          })
        })
      }
    }



    $scope.runChart=function(){
      google.load('visualization', '1.0', {
            packages: ['corechart'],
            callback: function() {

                // Create the data table.
                var data = new google.visualization.DataTable();
                data.addColumn('string', 'Choice');
                data.addColumn('number', 'Votes');
                var info = [];
                for (var i = 0; i < $scope.poll.choices.length; i++) {
                    info[i]=(['(' + $scope.poll.choices[i].name + ')', $scope.poll.choices[i].votes]);
                }

                data.addRows(info);

                // Set chart options
                var options = {'title':$scope.poll.title,
                               'width':400,
                               'height':300};

                // Instantiate and draw our chart, passing in some options.
                var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
                chart.draw(data, options);
                window.scrollTo(0,document.body.scrollHeight);

            }
          });
    }

    $scope.addChoice = function(){
      if ($scope.isLoggedIn()){

        var newChoice = prompt("What else should be on this poll?");
        if (newChoice !=="" && newChoice !== null) {

          $scope.poll.choices.push({name: newChoice,votes: 1});
          $scope.poll.voted.push($scope.getCurrentUser()._id);
          $scope.runChart();

          $http.delete('/api/polls/' + $scope.poll._id).success(function(){
            $http.post('/api/polls',$scope.poll).success(function(poll){
                $scope.poll=poll;
                console.log("you voted for " + $scope.poll.choices[$scope.formData.selection].name);
                console.log($scope.poll.voted)

                $scope.runChart();
            })
          })
        }


      }


    }

    $scope.spinalCase = function(str) {
       var valid="abcdefghijklmnopqrstuvwxyz1234567890";
       var caps="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
       var space="_ -";
       var newStr = "";
       for (var i = 0; i<str.length; i++) {
         if (caps.indexOf(str[i])!==-1) {
           if (i!==0 && newStr[newStr.length-1]!=="-") {
             newStr+="-";
           }
           newStr+=str[i].toLowerCase();
         } else if (valid.indexOf(str[i])==-1) {
           if (str[i]==" " || str[i]=="_" || str[i] == "-") {
             newStr+="-";
           }
         } else { newStr+=str[i]; }
       }
       return newStr;
     }


  });
