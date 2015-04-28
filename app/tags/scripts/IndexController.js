angular.module('tags', [])

.controller('tag_list', function($scope, $http) {
    // Controller functionality here
    $scope.show_tag_list = false;
   
    $scope.show_tag_result = true;


    $http.get("https://dry-coast-1630.herokuapp.com/tags")
    .success(function (response) {
    	$scope.tag_list = angular.fromJson(response);
 
    });

    

    $scope.search = function() {
    	if ($scope.input_tag === "") {
    		$scope.empty_result = "Oops, tag not found. :(";
    		$scope.show_tag_list = true;	
    		return;	
    	}

    	$http.get("https://dry-coast-1630.herokuapp.com/search/" + $scope.input_tag)
    	.success(function (data,status) {
    		
    		$scope.result = angular.fromJson(data);
    		// $scope.show_status = status;
    		$scope.show_tag_result = false;
    		$scope.show_tag_list = true;	
    	});
    }

});


// search by tags
// https://dry-coast-1630.herokuapp.com/search/:tags
// return the result of posts with tags

