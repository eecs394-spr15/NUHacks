angular.module('widesearch',[])
  .controller('searchpage', function($scope, $http){
  		$scope.hackey="";
		$scope.xx=false;
		$scope.tag_list=[];
		$scope.items=[];
		$scope.search = function(){
			$scope.items=[];
		  	$http.get("https://dry-coast-1630.herokuapp.com/search_hack/" + $scope.hackey)
		    	.success(function(data){

		    		// $scope.items = angular.fromJson(response);
		    		//alert($scope.items);
		    		data.forEach(function(elem, i, array) {
				        $scope.items.push(elem);
				      });

		    alert($scope.items);
		   });
		}
		
		  

    // Controller functionality here`
    // $scope.search = function(){
    // 	$http.get("https://dry-coast-1630.herokuapp.com/search_hack/" + $scope.hack_need)
    // 	.success(function(response){
    // 		$scope.searchpage = angular.fromJson(response);
    // 		$scope.xx=!$scope.xx;
    //   		});



    });
// app.filter('searchFor', function(){

// 	// All filters must return a function. The first parameter
// 	// is the data that is to be filtered, and the second is an
// 	// argument that may be passed with a colon (searchFor:hackey)

// 	return function(arr, hackey){

// 		if(!hackey){
// 			return arr;
// 		}

// 		var result = [];

// 		hackey = hackey.toLowerCase();

// 		// Using the forEach helper method to loop through the array
// 		angular.forEach(arr, function(item){

// 			if(item.title.toLowerCase().indexOf(hackey) !== -1){
// 				result.push(item);
// 			}

// 		});

// 		return result;
// 	};

// });