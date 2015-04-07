angular.module('example', [])
.controller('list', function($scope, $http) {
  $scope.list = [];
  $http.get('https://www.reddit.com/r/lifeprotips/new.json?sort=new')
      .success(function (response) {
        console.log(response.data.children[0].data.title);
      response.data.children.forEach (function (entry, i) {
        var tmp = {"element": entry.data.title};
        $scope.list.push(tmp);
      });
    }).error(function (response) {
      console.log(response);
    });
});