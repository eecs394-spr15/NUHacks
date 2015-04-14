angular.module('hacks', [])

.controller('list', function($scope, $http, $interval) {
  supersonic.logger.info("Hello");
  $scope.list = [];
  $scope.pages = 0;
  $scope.loading = false;

  $scope.vote = function(item, direction){
    if(item.voteStatus == direction){
      return;
    }

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
    if($scope.loading){
      return;
    }
    $scope.loading = true;
    
    var old_pages = $scope.pages;
    $scope.pages = 0;
    
    // replace old vote status for each item
    var onsuccess = function(data) {
      var old_list = {};
      $scope.list.forEach(function (item, i, array){
        old_list[item._id] = item.voteStatus;
      });
      
      data.forEach(function(item, i, array){
        var voteStatus = old_list[item._id];
        if(voteStatus){
          console.log("text: " + item.text);
          item.voteStatus = voteStatus;
        } else{
          console.log(old_list);
        }
      });

      $scope.list = [];
    };
    
    $scope.fetchPage(old_pages, onsuccess);
    
    
  };

  $scope.fetchPage = function(numpages, onsuccess){
    $scope.loading = true;
    $http.get('https://dry-coast-1630.herokuapp.com/posts/' + $scope.pages + '/' + ($scope.pages + numpages))
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