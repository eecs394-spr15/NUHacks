angular.module('tags', [])

.controller('tag_list', function($scope, $http) {
    // Controller functionality here

    $http.get("https://dry-coast-1630.herokuapp.com/posts/0/1")
    .success(function (response) {
    	$scope.tag_list = angular.fromJson(response);
    });
});

// search by tags
// https://dry-coast-1630.herokuapp.com/search/:tags
// return the result of posts with tags

