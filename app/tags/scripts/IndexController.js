angular.module('tags', [])

.controller('tag_list', function($scope, $http) {
    // Controller functionality here



    $http.get("https://dry-coast-1630.herokuapp.com/tags")
    .success(function (response) {
    	$scope.tag_list = angular.fromJson(response);
    });

    

    $scope.search = function() {
    	$http.get("https://dry-coast-1630.herokuapp.com/search/" + $scope.input_tag)
    	.success(function (response) {
    		$scope.result = angular.fromJson(response);
    	});
		//$scope.result = "John";
    }
});


// search by tags
// https://dry-coast-1630.herokuapp.com/search/:tags
// return the result of posts with tags

// todo: routing when clicking table rows,
// 		 use templates

