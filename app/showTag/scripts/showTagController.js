angular
  .module('showTag')
  .controller('showTagController', function($scope, $http) {
    // Controller functionality here
    $scope.tags = steroids.view.params.id;

    $http.get("https://dry-coast-1630.herokuapp.com/search/" + $scope.tags)
    	.success(function (data,status) {
    		
    		$scope.result = angular.fromJson(data);
    		// $scope.show_status = status;
    		// $scope.show_tag_result = false;
    		// $scope.show_tag_list = true;	
    	});
  });
