angular.module('example', [])
.controller('list', function($scope, $http) {
  $scope.list = [];
  $http.get('https://www.reddit.com/r/lifeprotips/new.json?sort=new')
      .success(function (response) {
        supersonic.logger.debug(response.data.children[1].data.title);
      response.data.children.forEach (function (entry, i) {
        var tmp = {
          "text": entry.data.title,
          "score" : entry.data.score};
        $scope.list.push(tmp);
      });
    }).error(function (response) {
      supersonic.logger.debug(response);
    });
});