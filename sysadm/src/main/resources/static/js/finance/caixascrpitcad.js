let userLogados = JSON.parse(localStorage.getItem("userLogado"))

let idEdit = JSON.parse(localStorage.getItem("idEdit"))

let logado = document.querySelector('#logado')

if (userLogados != null) {
	logado.innerHTML = userLogados.name
}

if (idEdit != null) {
	colocarEmEdicao(idEdit);
} else {
	idEdit = '';
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
	window.location.href = 'caixas';
	limpacampos();
})

function colocarEmEdicao(id) {

	$.ajax({
		method: "GET",
		url: "caixa/buscarcaixaid",
		data: "idcaixa=" + id,
		timeout: 0,
		headers: {
			Authorization: localStorage.getItem("token")
		},
		success: function(response) {

			$("#id").val(response.id);
			$("#banco").val(response.banco);
			$("#agencia").val(response.agencia);
			$("#conta").val(response.conta);
			$("#descricao").val(response.descricao);
			$("#saldo").val(response.saldo);

		}
	}).fail(function(xhr, status, errorThrown) {
		alert("Erro ao buscar usuário por id : " + xhr.responseText);
	});

}

function limpacampos() {
	$("#id").val("");
	$("#banco").val("");
	$("#agencia").val("");
	$("#conta").val("");
	$("#descricao").val("");
	$("#saldo").index(0);
}

document.querySelector('.save').addEventListener('click', () => {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", localStorage.getItem("token"));
	myHeaders.append('Content-Type', 'application/json;charset=utf-8');

	var id = $("#id").val();
	var banco = $("#banco").val();
	var agencia = $("#agencia").val();
	var conta = $("#conta").val();
	var descricao = $("#descricao").val();
	var saldo = $("#saldo").val();

	if (banco == null || banco != null && banco.trim() == '') {
		$("#banco").focus();
		alert('Informe um Banco');
		return;
	}

	if (agencia == null || agencia != null && agencia.trim() == '') {
		$("#email").focus();
		alert('Informe uma Agencia');
		return;
	}

	if (conta == null || conta != null && conta.trim() == '') {
		$("#email").focus();
		alert('Informe um Conta');
		return;
	}

	if (descricao == null || descricao != null && descricao.trim() == '') {
		$("#email").focus();
		alert('Informe um Descrição');
		return;
	}

	if (saldo == null || saldo != null && saldo.trim() == '') {
		$("#email").focus();
		alert('Informe um E-mail');
		return;
	}


	const users = {
		id: id,
		banco: banco,
		agencia: agencia,
		conta: conta,
		descricao: descricao,
		saldo: saldo,
	};


	fetch('caixa/salvar', {
		method: 'POST',
		headers: myHeaders,
		body: JSON.stringify(users)
	})
		.then(response => {
			return response.json();
		})
		.then(result => {
			$("#id").val(result.id);
			const msg = "Realizando cadatro.... ";
			msgSuccess(msg);
			setTimeout(() => {
				window.location.href = 'caixas'
				document.getElementById('formCadastroCaixa ').reset();
			}, 3000)
		})
		.catch(error => {
			console.log(error);
		});
})

function formatarMoeda() {
	var elemento = document.getElementById('saldo');
	var valor = elemento.value;

	valor = valor + '';
	valor = parseInt(valor.replace(/[\D]+/g, ''));
	valor = valor + '';
	valor = valor.replace(/([0-9]{2})$/g, ".$1");

	if (valor.length > 6) {
		valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
	}

	elemento.value = valor;
	if (valor == 'NaN') elemento.value = '';
}

