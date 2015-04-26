angular
  .module('showHack', ['ngSanitize'])
  .controller('showHackController', function($scope, $http) {
    // Controller functionality here
    $scope.posts = steroids.view.params.id;

    $http.get("https://dry-coast-1630.herokuapp.com/post/" + $scope.posts)
    	.success(function (data, status) {
    		$scope.item = angular.fromJson(data);
    	});

  });
