angular.module('profile', ['angular-loading-bar','ngAnimate'])

// Just copied from main feed controller
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.latencyThreshold = 50;
}])

.controller('IndexController', function($scope, $http, $interval, $animate) {
  supersonic.logger.info("Hello");
  $scope.list = [];
  $scope.pages = 0;
  $scope.loading = false;
  $scope.sortby = "-upvotes";
  $scope.old_votes = {};

  $scope.setSortBy = function(choice){
    console.log("sortby: " + choice);
    $scope.sortby = choice;
    $scope.update();
  };

  $scope.vote = function(item, direction){
    if(item.voteStatus == direction){
      item.voteStatus = 0;
      item.upvotes += direction * -1;
    } else if(item.voteStatus == -direction){
      item.voteStatus = direction;
      item.upvotes += 2 * direction;
    } else{
      item.upvotes += direction;
      item.voteStatus = direction;
    }

    $http.put('https://dry-coast-1630.herokuapp.com/post/' + item._id, {'upvotes':item['upvotes']})
      .success(function (data, status, header, config){})
      .error(function (response){
        item.text = response;
        supersonic.logger.debug(response);
      });
    };

  $scope.init = function(){
    $scope.fetchPage(0, undefined);
  };

  $scope.update = function(){

    if($scope.loading){
      return;
    }
    $scope.loading = true;
    
    var old_pages = $scope.pages;
    $scope.pages = 0;
    
    // replace old vote status for each item
    var onsuccess = function(data) {
      $scope.list.forEach(function (item, i, array){
        $scope.old_votes[item._id] = item.voteStatus;
      });
      
      data.forEach(function(item, i, array){
        var voteStatus = $scope.old_votes[item._id];
        if(voteStatus){
          console.log("text: " + item.text);
          item.voteStatus = voteStatus;
        } else{
          console.log("not found: " + item.text);
        }
      });

      $scope.list = [];
    };
    
    $scope.fetchPage(old_pages, onsuccess);
    
    
  };

  var getAuthorId = function(){
    return $window.localStorage['userId'];
  };

  $scope.fetchPage = function(numpages, onsuccess){
    $scope.loading = true;
    $http( {
      method: 'GET',
      url: 'https://dry-coast-1630.herokuapp.com/posts/' + $scope.pages + '/' + ($scope.pages + numpages),
      params: {sortby: $scope.sortby, authorId: getAuthorId()}
    })
    .success(function (data, status, header, config) {

      $scope.pages += 1;
      console.log("Current pages: " + $scope.pages);

      if(onsuccess){
          onsuccess(data);
        }
        
      data.forEach(function(elem, i, array) {
        if(!elem.voteStatus)
          elem.voteStatus = 0;
        $scope.list.push(elem);
      });

      $scope.loading = false;

      }).error(function (response) {
        console.log(response);
        $scope.loading = false;
      });
  };

  $scope.submitPost = function() {
    supersonic.logger.debug($scope.newTitle);
    supersonic.logger.debug($scope.newText);
    supersonic.logger.debug($scope.newTags);
    var user = {};
    user.text = $scope.newText;
    user.tags = $scope.newText.split(' ');
    $http.post('http://localhost:7000/post', user)
      .success(function(data, status, headers, config) {
        supersonic.debugger.info(data);
      });

  };

  $scope.init();
  $interval($scope.update, 60 * 1000);

})

// Need to make sure this only gets called once
// change "scroll" to "touchend"?
.directive("scroll", function ($window, $document) {
    return function(scope, element, attrs) {
      angular.element($window).bind("scroll", function(){
        var height = $document[0].body.offsetHeight - this.innerHeight;
        // load next page
         if (this.pageYOffset >= height && !scope.loading) {
            scope.fetchPage(0, undefined);
            console.debug(this.pageYOffset + " " + height);
         }
         // pull to refresh
         else if (this.pageYOffset <= 0 && !scope.loading){
            scope.update();
            console.log("not " + this.pageYOffset + " " + height);
         }
      });
    };
});