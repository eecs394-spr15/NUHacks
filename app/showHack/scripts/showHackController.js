angular
  .module('showHack', ['ngSanitize'])
  .controller('showHackController', function($scope, $http, $window) {
    // Controller functionality here
    $scope.posts = steroids.view.params.id;

    $http.get("https://dry-coast-1630.herokuapp.com/post/" + $scope.posts)
    	.success(function (data, status) {
    		$scope.item = angular.fromJson(data);
    	});

    $scope.own = function(hack) {
    	var authorID = $window.localStorage['authorId'];
    	return authorID === hack.authorId;
    };

    $scope.vote = function(item, direction){
        item.voteStatus = localStorageService.getVoteStatus(item._id);
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
    };

    $scope.deletePost = function(hack) {
    	var id = hack._id;
    	$http.delete('https://dry-coast-1630.herokuapp.com/post/' + id)
    		.success(function(data, status) {
    			if (data) {
    				steroids.logger.log('Post deleted!');
    				supersonic.data.channel('reload').publish({ status: true });
    				supersonic.ui.layers.pop();
    			} else {
    				steroids.logger.log('Post deletion failed!');
    			}
    		})
    		.error(function(data, status) {
    			steroids.logger.log(data);
    		});
    };

  });
