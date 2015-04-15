angular
  .module('showTag')
  .controller('showTagController', function($scope, $http, $interval) {

    $scope.tags = steroids.view.params.id;

    $http.get("https://dry-coast-1630.herokuapp.com/search/" + $scope.tags)
    	.success(function (data,status) {
    		
    		$scope.result = angular.fromJson(data);
    	});


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
	        var voteStatus = old_votes[item._id];
	        if(voteStatus){
	          console.log("text: " + item.text);
	          item.voteStatus = voteStatus;
	        } else{
	          console.log("not found: " + item.text);
	        }
	      });

	      $scope.list = [];
	    };
	  };
  })

 .directive("scroll", function ($window, $document) {
    return function(scope, element, attrs) {
      angular.element($window).bind("scroll", function(){
        var height = $document[0].body.offsetHeight - this.innerHeight;
        // load next page
         if (this.pageYOffset >= height && !scope.loading) {
            scope.fetchPage(0, undefined);
            console.log(this.pageYOffset + " " + height);
         }
         // pull to refresh
         else if (this.pageYOffset <= 0 && !scope.loading){
            scope.update();
            console.log("not " + this.pageYOffset + " " + height);
         }
      });
    };
});
