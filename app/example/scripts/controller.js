angular.module('example', [])

.controller('list', function($scope, $http, $interval) {
  $scope.list = [];
  $scope.pages = 0;

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
    }).error(function (response) {
      supersonic.logger.debug(response);
    });
  };

  $scope.update = function(){
    $scope.init();
  };

  $scope.fetchPage = function(){
    $scope.pages += 0;
    console.log($scope.pages);
  };

  $scope.init();
  $interval(function(){$scope.fetchPage();}, 700);
  $interval($scope.update, 60 * 1000);

})

// Need to make sure this only gets called once
.directive("scroll", function ($window, $document) {
    return function(scope, element, attrs) {
      angular.element($window).bind("scroll", function(){
        var height = $document[0].body.offsetHeight - this.innerHeight;
        // load next page
         if (this.pageYOffset >= height) {
            scope.fetchPage();
            console.log(this.pageYOffset + " " + height);
         }
         // pull to refresh
         else if (this.pageYOffset <= 0){
            scope.update();
            console.log("not " + this.pageYOffset + " " + height);
         }
      });
    };
});