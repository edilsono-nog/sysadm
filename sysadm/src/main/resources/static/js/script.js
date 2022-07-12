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
		  header = {"Authorization": localStorage.getItem("token") },
		  window.location = 'dashboard';
	  }
	}).fail(function (xhr, status, errorThrown) {
		localStorage.removeItem("token");
		alert("Usuário e/ou senha inválido: " + xhr.responseText);
	});
}