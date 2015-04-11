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
    $scope.list.forEach(function(elem, i, array){
      $http.get('https://dry-coast-1630.herokuapp.com/post/' + elem._id)
      .success(function (data, status, header, config) {
        elem.voteStatus = data.voteStatus;
      }).error(function (response) {
        console.log(response);
      });
    }); */
    
    var old_pages = $scope.pages;
    var old_list = {};
    $scope.list.forEach(function (item, i, array){
      old_list[item._id] = item.voteStatus;
    });
    $scope.pages = 0;
    $scope.list = [];
    for(var i=0; i<old_pages; i++){
      $scope.fetchPage();
    }
    // this part won't be necessary if doing checking server-side:
    $scope.list.forEach(function (item, i , array){
      var voteStatus = old_list[item._id];
      if(voteStatus){
        item.voteStatus = voteStatus;
      }
    });
    
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