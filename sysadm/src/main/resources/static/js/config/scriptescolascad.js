let userLogados = JSON.parse(localStorage.getItem("userLogado")) 

let idEdit = JSON.parse(localStorage.getItem("idEdit")) 

let logado = document.querySelector('#logado')

if (userLogados != null) {
    logado.innerHTML = userLogados.name
}

if (idEdit != null) {
    colocarEmEdicao(idEdit);
}else{
	idEdit='';
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

document.querySelector('.cancel').addEventListener('click', ()=>{
	window.location.href='escolaslist'
})

document.querySelector('.save').addEventListener('click', ()=>{
	var id = $("#id").val();
	var escola = $("#escola").val();
	
	if (escola == null || escola != null && escola.trim() == ''){
		$("#escola").focus();
		alert('Informe o Nome da escola');
		return;
	}


	$.ajax({
			method: "POST",
			url : "escolas/salvar",
			data : JSON.stringify({
				id: id,
				escola: escola
			}),
			contentType: "application/json; charset=utf-8",
			timeout: 0,
		    headers: {
		    Authorization: localStorage.getItem("token")
		 	 },
			success: function (response) {
				
				$("#id").val(response.id);
				const msg = "Realizando cadatro.... ";
				msgSuccess(msg);			
				setTimeout(() => {
					window.location.href='escolaslist'
					document.getElementById('formCadastroEscolas').reset();
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

function colocarEmEdicao(id) {

	$.ajax({
		method : "GET",
		url : "escolas/buscarescolaid",
		data : "idescola=" + id,
		timeout: 0,
	    headers: {
	    Authorization: localStorage.getItem("token")
	 	 },
		success : function(response) {
			
			$("#id").val(response.id);
			$("#escola").val(response.escola);
			

			localStorage.removeItem('idEdit')
		}
	}).fail(function(xhr, status, errorThrown) {
		alert("Erro ao buscar usuário por id : " + xhr.responseText);
	});

}

