let userLogado = JSON.parse(localStorage.getItem("userLogado")) 

let idFicha = JSON.parse(localStorage.getItem("idFicha")) 

let logado = document.querySelector('#logado')

if (userLogado != null) {
    logado.innerHTML = userLogado.name
}

if (idFicha != null) {
    autFicha(idFicha);
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

document.querySelector('button').addEventListener('click', ()=>{
	localStorage.removeItem('idFicha')
	window.location.href='listacad'
})

function autFicha(id) {

	$.ajax({
		method : "GET",
		url : "aluno/buscaralunoid",
		data : "iduser=" + id,
		timeout: 0,
	    headers: {
	    Authorization: localStorage.getItem("token")
	 	 },
		success : function(response) {
			var dataFormatada = response.dt_nasc.split('-').reverse().join('/');
			
			document.querySelector('.id').innerHTML = response.id;
			document.querySelector('.status').innerHTML = response.status;
			document.querySelector('.nome').innerHTML = response.nome;
			document.querySelector('.dtnascimento').innerHTML = dataFormatada;
			document.querySelector('.email').innerHTML = response.email;
			document.querySelector('.logradouro').innerHTML = response.logradouro;
			document.querySelector('.bairro').innerHTML = response.bairro;
			document.querySelector('.cidade').innerHTML = response.localidade;
			document.querySelector('.uf').innerHTML = response.uf;
			document.querySelector('.telefone').innerHTML = response.telefone;
			document.querySelector('.celular').innerHTML = response.celular;
			
			localStorage.removeItem('idEdit')
		}
	}).fail(function(xhr, status, errorThrown) {
		alert("Erro ao buscar usuário por id : " + xhr.responseText);
	});

}
