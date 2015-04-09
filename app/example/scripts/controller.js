angular.module('example', [])

.controller('list', function($scope, $http, $interval) {
  $scope.list = [];

  $scope.vote = function(item, direction){
    item.upvotes += direction * 1;
    $http.put('https://dry-coast-1630.herokuapp.com/post/' + item._id, {'upvotes':item['upvotes']})
      .success(function (data, status, header, config){})
      .error(function (response){
        item.text = response;
        supersonic.logger.debug(response);
      });
    };

  $scope.init = function(){
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
      $scope.$apply();
    }).error(function (response) {
      supersonic.logger.debug(response);
    });
  };

  $scope.update = function(){
    $scope.init();
  };

  $interval($scope.update, 1000);

});