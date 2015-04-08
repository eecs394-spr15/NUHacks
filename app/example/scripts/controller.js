angular.module('example', [])
.controller('list', function($scope, $http) {
  $scope.list = [];
  $http.get('https://dry-coast-1630.herokuapp.com/posts')
      .success(function (data, status, header, config) {
        supersonic.logger.debug(data);
      // response.data.children.forEach (function (entry, i) {
      //   var tmp = {
      //     "text": entry.data.text,
      //     "score" : entry.data.upvotes};
      //   $scope.list.push(tmp);
      // });
      $scope.list = data;
    }).error(function (response) {
      supersonic.logger.debug(response);
    });
});