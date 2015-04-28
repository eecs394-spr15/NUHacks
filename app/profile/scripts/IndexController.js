angular.module('profile', ['angular-loading-bar','ngAnimate', 'ngSanitize'])

.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.latencyThreshold = 10;
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.includeBar = true;
}])


.factory('localStorageService', function($window){

  var service = {};

  service.saveState = function(scope){
      $window.localStorage.setItem("old_votes", angular.toJson(scope.old_votes));
    };

  service.restoreState = function(scope){
      if ($window.localStorage['old_votes']) {
         scope.old_votes = angular.fromJson($window.localStorage['old_votes']);
       }
    };

  service.makeGuid = function(){
      function newGuid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
          s4() + '-' + s4() + s4() + s4();
      }

      if ($window.localStorage['authorId'] == undefined) {
        $window.localStorage.setItem('authorId', newGuid());
      }
    };

  service.getAuthorId = function(){
    return $window.localStorage['authorId'];
  };

  service.getVoteStatus = function(id){
    var old_votes = angular.fromJson($window.localStorage['old_votes']);
    return old_votes[id]
  }

  return service;
  
})

.controller('IndexController', function($scope, $http, $interval, $animate, $window, localStorageService) {
  
  $scope.list = [];
  $scope.pages = 0;
  $scope.loading = false;
  $scope.sortby = "-upvotes";
  $scope.old_votes = {};

  supersonic.data.channel('reload').subscribe(function(msg) {
    steroids.logger.log(msg.status);
    steroids.logger.log('visible now');
  });

  localStorageService.makeGuid();

  $scope.setSortBy = function(choice){
    console.log("sortby: " + choice);
    $scope.sortby = choice;
    $scope.update();
  };

  $scope.process = function(date){
    return date;
  };

  $scope.vote = function(item, direction){
    item.voteStatus = localStorageService.getVoteStatus(item._id);
    var delta_votes = 0;
    if(item.voteStatus == direction){
      item.voteStatus = 0;
      delta_votes = direction * -1;
    } else if(item.voteStatus == -direction){
      item.voteStatus = direction;
      delta_votes = 2 * direction;
    } else{
      delta_votes = direction;
      item.voteStatus = direction;
    }

    // This hardly seems like the ideal approach,
    // but angular won't update this object on the scope
    // unless it's a new copy of the object
    console.log(item._id);
    $scope.old_votes = jQuery.extend(true, {}, $scope.old_votes);
    $scope.old_votes[item._id] = item.voteStatus;
    localStorageService.saveState($scope);

    $http.put('https://dry-coast-1630.herokuapp.com/post/' + item._id +'/vote/' + delta_votes, {'upvotes':item['upvotes']}, {ignoreLoadingBar: true})
      .success(function (data, status, header, config){
        item.upvotes = data.upvotes + delta_votes;
      })
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
    
    // need to do after the http request so that the feed doesn't go blank
    // TODO: change to interceptor
    var onsuccess = function(data) {
      $scope.list = [];
    };
    
    $scope.fetchPage(old_pages - 1, onsuccess);
    
    
  };

  $scope.fetchPage = function(numpages, onsuccess){
    $scope.loading = true;
    $http( {
      method: 'GET',
      url: 'https://dry-coast-1630.herokuapp.com/posts/' + $scope.pages + '/' + ($scope.pages + numpages),
      params: {sortby: $scope.sortby, authorId: localStorageService.getAuthorId()}
    })
    .success(function (data, status, header, config) {

      $scope.pages += numpages + 1;
      console.log("Current pages: " + $scope.pages);

      data.forEach(function(item, i, array){
        var voteStatus = $scope.old_votes[item._id];
        if(voteStatus){
          console.log("text: " + item.text);
          item.voteStatus = voteStatus;
        } else{
          console.log("not found: " + item.text);
          console.log(item._id);
        }
      });

      if(onsuccess){
        onsuccess();
      }
        
      data.forEach(function(item, i, array) {
        var voteStatus = $scope.old_votes[item._id];
        if(voteStatus){
          console.log("text: " + item.text);
          item.voteStatus = voteStatus;
        } else{
          item.voteStatus = 0;
        }
        $scope.list.push(item);
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

  localStorageService.restoreState($scope);
  $scope.init();
  $interval($scope.update, 60 * 1000);
  $scope.$watch('old_votes', function(){localStorageService.saveState($scope);}, true);
  

})

// change "scroll" to "touchend"?
.directive("scroll", function ($window, $document) {
    return function(scope, element, attrs) {
      angular.element($window).bind("scroll", function(){
        var height = $document[0].body.offsetHeight - this.innerHeight;
         // pull to refresh
         if (this.pageYOffset <= 0 && !scope.loading){
            // steroids.logger.log($('#loader'));
            $('#loader').css('display', 'block');
            setTimeout(function() {
              $('#loader').css('display', 'none');
              scope.update();
            }, 400);
            console.log("not " + this.pageYOffset + " " + height);
         }
         // load next page
         else if (this.pageYOffset >= height && !scope.loading) {
            scope.fetchPage(0, undefined);
            console.debug(this.pageYOffset + " " + height);
         }
      });
    };
});