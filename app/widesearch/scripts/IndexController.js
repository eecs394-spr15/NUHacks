angular
  .module('searchhack',[])
  .controller('searchpage', function($scope,$http) {
  	//$scope.searchpage = [];
  	$scope.xx=0;
  	$scope.isxx=true;
    // Controller functionality here`
    $scope.search = function(){
    	$http.get("https://dry-coast-1630.herokuapp.com/search_hack/" + $scope.hack_need)
    	.success(function(response){
    		$scope.searchpage = angular.fromJson(response);
    		// $scope.xx=1;
      		});


    	});
    }
    $scope.isxxx = function(){
    	if ($scope.xx >1)
    		return true;
    	else
    		return false;
    	// $scope.xx=0
    };
    
  });
