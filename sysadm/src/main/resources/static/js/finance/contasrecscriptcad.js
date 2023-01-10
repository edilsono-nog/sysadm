let userLogados = JSON.parse(localStorage.getItem("userLogado"))
let idEdit = JSON.parse(localStorage.getItem("idEdit"))
let logado = document.querySelector('#logado')
let emissao = document.querySelector('#emissao');

var dateNow = new Date();
emissao.disabled = true;

if (userLogados != null) {
	logado.innerHTML = userLogados.name
}

if (idEdit != null) {
	colocarEmEdicao(idEdit);
} else {
	idEdit = '';
	$("#emissao").val(dateNow.toLocaleDateString()); 
}

if (getCookie('JSESSIONID') == null) {
	alert('Você precisa estar logado para acessar essa página')
	window.location.href = 'login'
}

function getCookie(nome) {
	var nomeCookie = nome + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nomeCookie) == 0) return c.substring(nomeCookie.length, c.length);
	}
	return null;
}

function eraseCookie(nome) {
	document.cookie = nome + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

document.querySelector('.cancel').addEventListener('click', () => {
	localStorage.removeItem('idEdit');
	window.location.href = 'contasareceber';
	limpacampos();
})

function limpacampos() {
	$("#id").val("");
	$("#descricao").val("");
	$("#emissao").val("");
	$("#vencimento").val("");
	$("#observacao").val("");
	$("#valor").val("");
}

function formatarMoeda() {
	var elemento = document.getElementById('valor');
	var valor = elemento.value;

	valor = valor + '';
	valor = parseInt(valor.replace(/[\D]+/g, ''));
	valor = valor + '';
	valor = valor.replace(/([0-9]{2})$/g, ".$1");

	if (valor.length > 6) {
		valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1.$2");
	}

	elemento.value = valor;
	if (valor == 'NaN') elemento.value = '';
}
