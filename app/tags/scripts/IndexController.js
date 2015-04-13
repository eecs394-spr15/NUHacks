angular.module('tags', [])

.controller('tag_list', function($scope, $http) {
    // Controller functionality here

    //todo: change this url to backend.
    //this is test data from w3school.
    $http.get("http://www.w3schools.com/angular/customers.php")
    .success(function (response) {
    	$scope.tag_list = response.records;
    });
});