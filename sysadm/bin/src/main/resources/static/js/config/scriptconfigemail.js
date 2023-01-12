let userLogados = JSON.parse(localStorage.getItem("userLogado")) 

let logado = document.querySelector('#logado')

if (userLogados != null) {
    logado.innerHTML = userLogados.name
    carregaConfig();
}

if (getCookie('JSESSIONID') == null) {
    alert('Você precisa estar logado para acessar essa página')
    window.location.href = 'login'
}

function getCookie(nome) {
    var nomeCookie = nome + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nomeCookie) == 0) return c.substring(nomeCookie.length,c.length);
    }
    return null;
}

function eraseCookie(nome) {   
    document.cookie = nome +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function carregaConfig(){
	$.ajax({
		method : "GET",
		url : "email/configemail",
		timeout: 0,
	    headers: {
	    Authorization: localStorage.getItem("token")
	 	 },
		success : function(response) {
			
			for(i = 0; i < response.length; i++){
				$("#id").val(response[i].id);
				$("#servidor").val(response[i].servidor);
				$("#email").val(response[i].email);
				$("#senha").val(response[i].senha);
				$("#auth").val(response[i].auth);
				$("#host").val(response[i].host);
				$("#port").val(response[i].port);
				$("#factory_class").val(response[i].socketFactory_class);
				$("#factory_port").val(response[i].socketFactory_port);
				$("#starttls").val(response[i].starttls);
				$("#trust").val(response[i].trust);
			}
			
			
			
		}
	}).fail(function(xhr, status, errorThrown) {
		alert("Erro ao buscar usuário por id : " + xhr.responseText);
	});
}

document.querySelector('.fechar').addEventListener('click', ()=>{
	window.location.href='configuracoes'
})

document.querySelector('.delete').addEventListener('click', ()=>{
	var id = $("#id").val();
	
	$.ajax({
			method: "DELETE",
			url : "email/delete?idConfig="+id,
			contentType: "application/json; charset=utf-8",
			timeout: 0,
		    headers: {
		    Authorization: localStorage.getItem("token")
		 	 },
			success: function (xhr, response) {
				
				const msg = xhr;
				msgSuccess(msg);			
				setTimeout(() => {
					carregaConfig();
				},3000)
			}
		}).fail(function (xhr, status, errorThrown) {
			const msg = "Error ao cadatrar.... " + xhr.responseText;
			msgError(msg);
		});
})

document.querySelector('.save').addEventListener('click', ()=>{
	var id = $("#id").val();
	var servidor = $("#servidor").val();
	var email = $("#email").val();
	var senha = $("#senha").val();
	var auth = $("#auth").val();
	var host = $("#host").val();
	var port = $("#port").val();
	var factory_class = $("#factory_class").val();
	var factory_port = $("#factory_port").val();
	var starttls = $("#starttls").val();
	var trust = $("#trust").val();
	
	$.ajax({
			method: "POST",
			url : "email/salvar",
			data : JSON.stringify({
				id: id,
				servidor: servidor,
				email: email,
				senha: senha,
				auth: auth,
				host: host,
				port: port,
				socketFactory_class: factory_class,
				socketFactory_port: factory_port,
				starttls: starttls,
				trust: trust
			}),
			contentType: "application/json; charset=utf-8",
			timeout: 0,
		    headers: {
		    Authorization: localStorage.getItem("token")
		 	 },
			success: function (response) {
				
				const msg = "Realizando cadatro.... ";
				msgSuccess(msg);			
				setTimeout(() => {
					carregaConfig();
				},3000)
			}
		}).fail(function (xhr, status, errorThrown) {
			const msg = "Error ao cadatrar.... " + xhr.responseText;
			msgError(msg);
		});
})

const divMessage = document.querySelector(".alert");

function msgSuccess(msg) {
    const message = document.createElement("div");
    message.classList.add("messageSucesso");
    message.innerText = msg;
    divMessage.appendChild(message);

    setTimeout(() => {
        message.style.display = "none";
    }, 3000);
}

function msgError(msg) {
    const message = document.createElement("div");
    message.classList.add("messageError");
    message.innerText = msg;
    divMessage.appendChild(message);

    setTimeout(() => {
        message.style.display = "none";
    }, 3000);
}
