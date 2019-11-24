const app = angular.module('app', ['ngRoute', 'ngResource']).run(function($rootScope){

});

app.config(function($routeProvider){
  $routeProvider
    //the welcome/info display
    .when('/', {
      templateUrl: 'main.html',
      controller: 'mainController'
    })
    //the our story display
    .when('/ourstory', {
      templateUrl: 'ourstory.html',
      controller: 'mainController'
    })
    //the rsvp display
    .when('/rsvp', {
      templateUrl: 'rsvp.html',
      controller: 'mainController'
    })
    //the gifts display
    .when('/gifts', {
      templateUrl: 'gifts.html',
      controller: 'mainController'
    })
    //the reservation display
    .when('/reservation/:id', {
      templateUrl: 'reservation.html',
      controller: 'reservationController'
    })
    //Wildcard redirect to home
    .when('**', {
      redirectTo: '/'
    });
});

app.factory('reservationService', function($resource){
	return $resource('/api/reservations/:id');
});

app.controller('mainController', function($rootScope, $scope, reservationService){
  $scope.id = '';

  $scope.getReservation = function(){
    window.location = `#/reservation/${$scope.id}`;
  }
});

app.controller('reservationController', function($rootScope, $scope, $routeParams, $http, reservationService){
  $scope.reservation = reservationService.get({id: $routeParams.id});

	$scope.submitRSVP = function(){
    $scope.reservation.$save();
    $scope.reservation = $http.put('/api/reservations/' + $routeParams.id, {
      "guests": $scope.reservation.guests,
      "content": $scope.reservation.content
    });

    return $scope.reservation.hasSubmitted = true;
  }
});
