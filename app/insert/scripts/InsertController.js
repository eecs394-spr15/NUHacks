angular
  .module('insert')
  .controller('InsertController', function($scope, $http, supersonic) {
    steroids.logger.log('Hello there!');
    $scope.submitPost = function() {
      steroids.logger.log('Inside submitPost()');
    	var user = {};
    	user.text = $scope.newText;
      user.author = 'User';
      steroids.logger.log(user.text);
      steroids.logger.log(user.author);
    	// user['tags'] = $scope.newTags.split(' ');
    	$http.post('https://dry-coast-1630.herokuapp.com/post', user).
    		success(function(data, status, headers, config) {
          steroids.logger.log('success');
          steroids.logger.log(status);
        }).
        error(function(data, status, headers, config) {
          steroids.logger.log('error occurred');
          steroids.logger.log(status);
        });
    };
  });
