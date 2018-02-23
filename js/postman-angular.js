angular.module('postman-tegar',[])
//controller for contrib table
.controller('contribution', ['$scope', function($scope){
	var html="<div class='m-2'>";
	var random=0;
	html+="<div class='row'>";
	html+="<div class='col-md-1'><div class='mt-4'>Mon</div><div class='my-2'>Wed</div><div class='my-2'>Fri</div></div>";
	html+="<div class='col-md-11'><div class='row justify-content-between'><div class='col-md-1'>Mar</div><div class='col-md-1'>Apr</div><div class='col-md-1'>May</div><div class='col-md-1'>Jun</div><div class='col-md-1'>Jul</div><div class='col-md-1'>Aug</div><div class='col-md-1'>Sep</div><div class='col-md-1'>Oct</div><div class='col-md-1'>Nov</div><div class='col-md-1'>Dec</div><div class='col-md-1'>Jan</div><div class='col-md-1'>Feb</div></div>";
	for(var j=0; j<7;j++){
		html+="<div class='row mb-1 justify-content-between'>";
		for(var i=0; i<48;i++) {
			random=Math.floor((Math.random() * 5) + 1);
			random_contrib=Math.floor((Math.random() * 50) + 1)+50*(random-1);
			html+="<div class='mr-1 cell-fill-"+random+"' style='min-width:10px;min-height:10px;' data-toggle='tooltip' data-placement='top' title='"+random_contrib+" contribution'></div>";
		}
		html+="</div>"
	}
	html+="</div></div></div>"
	$scope.myhtml=html;
}])
.directive('contribTable', function(){
	return function(scope, element) {
		element.html(scope.myhtml);
		
		$(function () {
			$('[data-toggle="tooltip"]').tooltip();
		})
	};
})

//setting up apis
.controller('api', ['$scope', '$q', function($scope, $q){

	//get APIS List
	$scope.getApisList=function(){
		//load json file
		var deferred = $q.defer();
		$.getJSON("json/GITHUB.postman_collection.json", function(json) {
			var apis_list={};
			$.each( json.item, function(key, val) {
				apis_list[val.name]=val;
			});
			
			deferred.resolve(apis_list);			
		});	
		return deferred.promise;
	}

	//call spesific api
	$scope.getApi=function(api){
		//load an API
		var deferred = $q.defer();
		var xhttp = new XMLHttpRequest();
	    xhttp.open(api.request.method, api.request.url, true);
	    xhttp.setRequestHeader("Content-type", "application/json");
	    xhttp.send();
		xhttp.onreadystatechange = function() {
		    var api = JSON.parse(xhttp.responseText);
		    deferred.resolve(api);
		}
		return deferred.promise;
	}

	$scope.apis={};
	$scope.getApisList().then(function (apis_list) {
		$scope.apis_list=apis_list;

		//running Postman APIS
		$scope.getApi($scope.apis_list["GET USER DETAILS"]).then(function(api){
			$scope.apis.user_details=api;
		});
		$scope.getApi($scope.apis_list["GET REPOSITORIES STARRED"]).then(function(api){
			$scope.apis.repo_starred=api;
			loadStarredLayout(api)
		});
	});

}
]);

function loadStarredLayout(api){
	//set html for first 4 repos
	var html="<div class='row font-lat'>";
	var column_count=0;
	var showed_repos=0;
	//get repos
	$.each( api, function(key, val) {
			if(column_count>=2) {html+="</div><div class='row font-lat'>";column_count=0;}
			html+="<div class='col-md-6 p-0'><div class='mt-2 mx-2 p-3 border border-bottom-0 rounded-top' style='min-height:100px;'>";
			html+="<div><a href='"+val.html_url+"' target='_blank'>"+val.full_name+"</a></div><div>"+val.description+"</div>";
			html+="</div>";
			html+="<div class='form-inline mx-2 mb-2 p-3 border border-top-0 rounded-bottom'>";
			html+="<img class='grayscale mr-2' style='width:17px; height:auto;' src='img/star.png'/>"+val.stargazers_count;
			html+="<img class='grayscale brightness ml-3 mr-2' style='width:20px; height:auto;' src='img/fork.png'/>"+val.forks_count;
			html+="</div></div>";
			column_count++;
			showed_repos++;
			if (showed_repos>=4) return false;
		});
	html+="</div>";
	$("#sub-content").html(html);
}
