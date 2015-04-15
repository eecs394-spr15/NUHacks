angular
  .module('showTag')
  .controller('showTagController', function($scope, $http) {
    // Controller functionality here
    $scope.tags = steroids.view.params.id;

    $http.get("https://dry-coast-1630.herokuapp.com/search/" + $scope.tags)
    	.success(function (data,status) {
    		
    		$scope.result = angular.fromJson(data);
    	});
  });
