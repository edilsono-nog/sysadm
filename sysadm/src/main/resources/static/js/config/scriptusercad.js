let userLogados = JSON.parse(localStorage.getItem("userLogado"))

let idEdit = JSON.parse(localStorage.getItem("idEdit"))

let logado = document.querySelector('#logado')
let form = document.querySelector("#formCadastrouser");
const divMessage = document.querySelector(".alert");

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
	window.location.href = 'usuarios'
	limpacampos();
})



document.querySelector('.save').addEventListener('click', () => {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", localStorage.getItem("token"));
	myHeaders.append('Content-Type', 'application/json;charset=utf-8');

	var id = $("#id").val();
	var nome = $("#nome").val();
	var email = $("#email").val();
	var cpfs = $("#cpf").val();
	var login = $("#login").val();
	var senha = $("#senha").val();
	var roles = $("#descricao").val();
	
	if (nome == null || nome != null && nome.trim() == '') {
		$("#nome").focus();
		alert('Informe o nome');
		return;
	}
	
	if (email == null || email != null && email.trim() == '') {
		$("#email").focus();
		alert('Informe um E-mail');
		return;
	}

	if (roles == "Selecione...") {
		$("#descricao").focus();
		alert('Selecione um Nível para o Usuário');
		return;
	}

	const users = {
		id: id,
		nome: nome,
		email: email,
		cpf: cpfs,
		login: login,
		senha: senha,
		roles: roles
	};


	fetch('usuario/salvar?role='+roles, {
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
				window.location.href = 'usuarios'
				document.getElementById('formCadastrouser').reset();
			}, 3000)
		})
		.catch(error => {
			console.log(error);
		});
})

const cpf = document.querySelector('#cpf')

cpf.addEventListener('keypress', () => {
	let cpflength = cpf.value.length

	if (cpflength == 3 || cpflength == 7) {
		cpf.value += '.'
	} else if (cpflength == 11) {
		cpf.value += '-'
	}
})

let labelCpf = document.querySelector('.labelCpf')

cpf.onblur = function() {
	if (!validarCPF(cpf.value)) {
		labelCpf.setAttribute('style', 'color: red;')
		labelCpf.innerHTML = 'CPF:  *Inválido'
		cpf.setAttribute('style', 'border-color: red;')
		cpf.focus();
	} else {
		labelCpf.setAttribute('style', 'color: black;')
		labelCpf.innerHTML = 'CPF:'
		cpf.setAttribute('style', 'border-color: black;')
	}
}

function validarCPF(cpf) {
	cpf = cpf.replace(/[^\d]+/g, '');
	if (cpf == '') return false;
	// Elimina CPFs invalidos conhecidos	
	if (cpf.length != 11 ||
		cpf == "00000000000" ||
		cpf == "11111111111" ||
		cpf == "22222222222" ||
		cpf == "33333333333" ||
		cpf == "44444444444" ||
		cpf == "55555555555" ||
		cpf == "66666666666" ||
		cpf == "77777777777" ||
		cpf == "88888888888" ||
		cpf == "99999999999")
		return false;
	// Valida 1o digito	
	add = 0;
	for (i = 0; i < 9; i++)
		add += parseInt(cpf.charAt(i)) * (10 - i);
	rev = 11 - (add % 11);
	if (rev == 10 || rev == 11)
		rev = 0;
	if (rev != parseInt(cpf.charAt(9)))
		return false;
	// Valida 2o digito	
	add = 0;
	for (i = 0; i < 10; i++)
		add += parseInt(cpf.charAt(i)) * (11 - i);
	rev = 11 - (add % 11);
	if (rev == 10 || rev == 11)
		rev = 0;
	if (rev != parseInt(cpf.charAt(10)))
		return false;
	return true;
}


$(document).ready(function() {

	$.ajax({
		method: "GET",
		url: "usuario/pegaRoles",
		timeout: 0,
		headers: {
			Authorization: localStorage.getItem("token")
		},
		success: function(response) {
			for (var i = 0; i < response.length; i++) {
				$('#descricao').append(
					'<option value=' + response[i].id + '>' + response[i].descricao + '</option>'
				);
			}
		}
	}).fail(function(xhr, status, errorThrown) {
		alert("Erro ao atualizar lita anoletivo: " + xhr.responseText);
	});

});

function limpacampos() {
	$("#id").val("");
	$("#nome").val("");
	$("#email").val("");
	$("#cpf").val("");
	$("#login").val("");
	$("#descricao").index(0);
}

function colocarEmEdicao(id) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", localStorage.getItem("token"));

	let password = document.querySelector("#confPassword");

	password = password.value;

	fetch('usuario/pegaUser?iduser=' + id, {
		method: 'GET',
		headers: myHeaders
	})
		.then(response => {
			return response.json();
		})
		.then(result => {
			$("#id").val(result.id);
			$("#nome").val(result.nome);
			$("#email").val(result.email);
			$("#cpf").val(result.cpf);
			$("#login").val(result.login);
			if(result.authorities.length > 0 ){
				$("#descricao option:selected").text(result.authorities[0].descricao);
			}
			

			localStorage.removeItem('idEdit')
		})
		.catch(error => {
			console.log(error);
		});
}

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
