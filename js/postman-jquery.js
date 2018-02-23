function getAPI(api) {
    var xhttp = new XMLHttpRequest();
    xhttp.open(api.request.method, api.request.url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send();
	xhttp.onreadystatechange = function() {
	    var data = JSON.parse(xhttp.responseText);

	    
	    return false;
		//run function
		switch(api.name) {
		    case "GET USER DETAILS":
		        updateProfil(data);
		        updateRepo(data);
		        updateFollowers(data);
		        updateFollowing(data);
		        break;
		    case "SEARCH REPOSITORIES":
		        break;
	        case "GET USER FOLLOWERS":
		        // updateFollowers(data);
		        break;
	        case "GET USER FOLLOWING":
		        // updateFollowing(data);
		        break;
	        case "GET REPOSITORIES STARRED":
		        updateStars(data);
		        updateSubContentOverview(data);
		        break;
	        case "GET USER REPOSITORIES":
		        // updateRepo(data);
		        break;
	        case "GET REPOSITORY DETAILS":
		        // code block
		        break;
		    default:
		        // code block
		}
	}
}

//do when doc loaded
$( document ).ready(function() {
	
	//load json file
	$.getJSON("json/GITHUB.postman_collection.json", function(json) {
		apis={};
		$.each( json.item, function(key, val) {
			apis[val.name]=val;
		});

		//run APIs
		getAPI(apis["GET USER DETAILS"]);
		getAPI(apis["GET REPOSITORIES STARRED"]);
		updateContribution();
	});
});

//update profil
function updateProfil(data){
	$("#avatar").attr("src", data.avatar_url);
	$("#alt").attr("src", data.gravatar_id);
	$("#name").html(data.name);
	$("#id_login").html(data.login);
	$("#bio").html(data.bio);
	$("#company").html("<a href='https://github.com/labku' target='_blank'>"+data.company+"</a>");
	$("#location").html(data.location);
	$("#email").html(data.email);
	$("#blog").html("<a href='"+data.blog+"' target='_blank'>"+data.blog+"</a>");
}

//update Repo
function updateRepo(data){
	$("#repo_notif").html(data.public_repos);
}

//update stars
function updateStars(data){
	$("#stars_notif").html(data.length);
}

//update Followers
function updateFollowers(data){
	$("#followers_notif").html(data.followers);
}

//update Following
function updateFollowing(data){
	// $("#following_notif").html(data.length);
	$("#following_notif").html(data.following);
}

//update updateSubContentOverview
function updateSubContentOverview(data){
	//set html for first 4 repos
	var html="<div class='row font-lat'>";
	var column_count=0;
	var showed_repos=0;
	//get repos
	$.each( data, function(key, val) {
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

function updateContribution(){
	var html="<div class='m-2'>";
	var random=0;
	html+="<div class='row'>";
	html+="<div class='col-md-1'><div class='mt-4'>Mon</div><div class='my-2'>Wed</div><div class='my-2'>Fri</div></div>";
	html+="<div class='col-md-11'><div class='row justify-content-between'><div class='col-md-1'>Mar</div><div class='col-md-1'>Apr</div><div class='col-md-1'>May</div><div class='col-md-1'>Jun</div><div class='col-md-1'>Jul</div><div class='col-md-1'>Aug</div><div class='col-md-1'>Sep</div><div class='col-md-1'>Oct</div><div class='col-md-1'>Nov</div><div class='col-md-1'>Dec</div><div class='col-md-1'>Jan</div><div class='col-md-1'>Feb</div></div>";
	for(var j=0; j<7;j++){
		html+="<div class='row mb-1 justify-content-between'>";
		for(var i=0; i<48;i++) {
			random=Math.floor((Math.random() * 5) + 1);
			html+="<div class='mr-1 cell-fill-"+random+"' style='min-width:10px;min-height:10px;' data-toggle='tooltip' data-placement='top' title='Tooltip on top'></div>";
		}
		html+="</div>"
	}
	html+="</div></div></div>"
	$("#table-contrib").html(html);

	$(function () {
	  $('[data-toggle="tooltip"]').tooltip()
	})
}