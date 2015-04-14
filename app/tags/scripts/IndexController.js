angular.module('tags', [])

.controller('tag_list', function($scope, $http) {
    // Controller functionality here

    $http.get("https://dry-coast-1630.herokuapp.com/posts/0/1")
    .success(function (response) {
    	$scope.tag_list = angular.fromJson(response);
    });
});

// .config(function($routeProvider) {
// 	$routeProvider.
//     when('/list', {
//         controller: ListCtrl,
//         templateUrl: 'list.html'
//     }).
//         when('/detail/:tag', {
//         controller: DetailCtrl,
//         templateUrl: 'detail.html'
//     }).
//     otherwise({
//         redirectTo: '/list'
//     });
// });


// function ListCtrl($scope, $location) {
//     $scope.items = data;
    
//     $scope.goto_detail = function(tag) {
//         $location.url('/detail/' + tag);
//     };
// }

// function DetailCtrl($scope, $location, $routeParams) {
//     $scope.item = data[$routeParams.id];

//     $scope.goto_list = function() {
//         $location.url('/list');
//     };
// }