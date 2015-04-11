angular.module('example', [])

.controller('list', function($scope, $http, $interval) {
  $scope.list = [];
  $scope.pages = 0;

  $scope.vote = function(item, direction){
    if(item.voteStatus == direction)
      return;

    item.upvotes += direction * 1;
    item.voteStatus = direction;

    $http.put('https://dry-coast-1630.herokuapp.com/post/' + item._id, {'upvotes':item['upvotes']})
      .success(function (data, status, header, config){})
      .error(function (response){
        item.text = response;
        supersonic.logger.debug(response);
      });
    };

  $scope.init = function(){
    $scope.fetchPage();
  };

  $scope.update = function(){
    /*
    replace the upvotes for each item
    doesn't get new posts that may have been added,
    so once we had server-side verification we'll want
    to use the method below (fetch by page) */
    $scope.list.forEach(function(elem, i, array){
      $http.get('https://dry-coast-1630.herokuapp.com/post/' + elem._id)
      .success(function (data, status, header, config) {
        elem.upvotes = data.upvotes;
      }).error(function (response) {
        console.log(response);
      });
    });
    
    /* fetch by page:
    var old_pages = $scope.pages;
    $scope.pages = 0;
    $scope.list = [];
    for(var i=0; i<old_pages; i++){
      $scope.fetchPage();
    }
    */
  };

  $scope.fetchPage = function(){ 
    $http.get('https://dry-coast-1630.herokuapp.com/posts/' + $scope.pages)
      .success(function (data, status, header, config) {
        
        data.forEach(function(elem, i, array) {
          elem.voteStatus = 0;
          $scope.list.push(elem);
        });

        $scope.pages += 0;
        console.log($scope.pages);

      }).error(function (response) {
        console.log(response);
      });
 
  };

  $scope.init();
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