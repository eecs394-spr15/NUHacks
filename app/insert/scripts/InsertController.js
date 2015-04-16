angular
  .module('insert')
  .config(function(tagsInputConfigProvider) {
  tagsInputConfigProvider
    .setDefaults('tagsInput', {
      placeholder: 'Add tags',
      minLength: 1,
      addOnEnter: true,
      addOnSpace: true
    })
    .setDefaults('autoComplete', {
      debounceDelay: 200,
      loadOnDownArrow: true,
      loadOnEmpty: true
    })
  })
  .controller('InsertController', function($scope, $http, supersonic) {
    steroids.logger.log('Hello there!');

    var appendTransform = function(defaults, transform) {
      defaults = angular.isArray(defaults) ? defaults : [defaults];
      return defaults.concat(transform);
    };
    
    $scope.loadTags = function(query) {
      return $http({
        url: 'https://dry-coast-1630.herokuapp.com/tags',
        method: 'GET',
        transformResponse: appendTransform($http.defaults.transformResponse, function(data) {
          data.forEach(function(item, i, array){
            array[i] = item._id;
          });
          return data;
        })
      });
    };

    $scope.submitPost = function(post) {
      steroids.logger.log('Inside submitPost()');
      post.author = 'User';
      post.tags.forEach(function(item, i, array){
        array[i] = item["text"];
      });
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
