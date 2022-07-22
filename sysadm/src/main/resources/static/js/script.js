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
		  let jsession = Math.random().toString(16).substr(2) + Math.random().toString(16).substr(2)
		  setCookie('JSESSIONID', jsession, 0)
		  window.location='dashboard';
	  }
	}).fail(function (xhr, status, errorThrown) {
		localStorage.removeItem("token");
		const msg = "Usuário e/ou senha inválido: " + xhr.responseText;
		ativar(msg);
		//$.notify("Usuário e/ou senha inválidos" + xhr.responseText, "error");
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

function setCookie(nome,valor,days) {
    var validade = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        validade = "; expires=" + date.toUTCString();
    }
    document.cookie = nome + "=" + (valor || "")  + validade + "; path=/";
}