function login(){
	
	var username = $('#typeUsername').val();
	var password = $('#typePassword').val();
	
	$.ajax({
		method: "POST",
		url: "login1",
		data: JSON.stringify({
			login: username,
			senha: password
	  }),
	 success: function (response) {
		  localStorage.removeItem("token");
		  token = response.replace('{"Authorization": "', '');
		  token = token.replace('"}', '');
		  localStorage.setItem("token",  token);
		  dashboard();
	  }
	}).fail(function (xhr, status, errorThrown) {
		localStorage.removeItem("token");
		alert("Usuário e/ou senha inválido: " + xhr.responseText);
	});
}

function dashboard() {
	$.ajax({
		crossDomain: true,
		method: "GET",
		url: "dashboard",
		headers: {"Authorization": localStorage.getItem("token")},
		success: function(){
			window.location='dashboard';
		}
	});
	
	/*var settings = {
    "crossDomain": true,
    "url": "dashboard",
    "method": "GET",
    "dataType": "json",
    "headers": {
	 "content-type": "application/x-www-form-urlencoded",
     "Authorization": localStorage.getItem("token")
    },
	   "data": {
	   "name": "name"
  }
 }

    $.ajax(settings).done(function (data,status, xhr) {
     console.log("Authorization=> "+xhr.getResponseHeader('Authorization'));
   //  console.log(localStorage.getItem("token"));
 });  */  
	
}