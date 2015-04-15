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

// todo: routing when clicking table rows,
// 		 use templates


// .config(function($routeProvider) {
//     $routeProvider.
//     when('/list', {
//         controller: ListCtrl,
//         templateUrl: 'list.html'
//     }).
//         when('/detail/:id', {
//         controller: DetailCtrl,
//         templateUrl: 'detail.html'
//     }).
//     otherwise({
//         redirectTo: '/list'
//     });
// });

