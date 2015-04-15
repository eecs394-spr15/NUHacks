angular
  .module('insert')
  .controller('InsertController', function($scope, $http, supersonic) {
    steroids.logger.log('Hello there!');
    $scope.submitPost = function(post) {
      steroids.logger.log('Inside submitPost()');
      post.author = 'User';
      steroids.logger.log(post.text);
      steroids.logger.log(post.author);
    	// user['tags'] = $scope.newTags.split(' ');
    	$http.post('https://dry-coast-1630.herokuapp.com/post', post).
    		success(function(data, status, headers, config) {
          steroids.logger.log('success');
          steroids.logger.log(status);
          supersonic.ui.layers.pop();
        }).
        error(function(data, status, headers, config) {
          steroids.logger.log('error occurred');
          steroids.logger.log(status);
        });
    };
  });
