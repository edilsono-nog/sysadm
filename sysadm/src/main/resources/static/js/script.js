const divMessage = document.querySelector(".alert");

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
		const msg = "Usuário e/ou senha inválido: " + xhr.responseText;
		ativar(msg);
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
}

function ativar(msg) {
    const message = document.createElement("div");
    message.classList.add("message");
    message.innerText = msg;
    divMessage.appendChild(message);

    setTimeout(() => {
        message.style.display = "none";
    }, 3000);
}