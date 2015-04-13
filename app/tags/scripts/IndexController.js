angular
  .module('tags')
  .controller('IndexController', function($scope, supersonic) {
    // Controller functionality here
    $scope.callRestService= function() {
  		$http({method: 'GET', url: '/someUrl'}).
  			success(function(data, status, headers, config) {
        		$scope.results.push(data);  //retrieve results and add to existing results
    		})
		}
  });

app.directive('myOnKeyDownCall', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {            
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
        });
    };
});