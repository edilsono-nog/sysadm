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

const cep = document.querySelector('#cep')

cep.addEventListener('keypress', () => {
	let ceplength = cep.value.length

	if (ceplength == 5) {
		cep.value += '-'
	}
})


$(document).ready(function() {

	function limpa_formulário_cep() {
		// Limpa valores do formulário de cep.
		$("#logradouro").val("");
		$("#complemento").val("");
		$("#bairro").val("");
		$("#cidade").val("");
		$("#uf").val("");
	}

	//Quando o campo cep perde o foco.
	$("#cep").blur(function() {

		//Nova variável "cep" somente com dígitos.
		var cep = $(this).val().replace(/\D/g, '');

		//Verifica se campo cep possui valor informado.
		if (cep != "") {

			//Expressão regular para validar o CEP.
			var validacep = /^[0-9]{8}$/;

			//Valida o formato do CEP.
			if (validacep.test(cep)) {

				//Preenche os campos com "..." enquanto consulta webservice.
				$("#logradouro").val("...");
				$("#complemento").val("...");
				$("#bairro").val("...");
				$("#cidade").val("...");
				$("#uf").val("...");

				//Consulta o webservice viacep.com.br/
				$.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function(dados) {

					if (!("erro" in dados)) {
						//Atualiza os campos com os valores da consulta.
						$("#logradouro").val(dados.logradouro);
						$("#complemento").val(dados.complemento);
						$("#bairro").val(dados.bairro);
						$("#cidade").val(dados.localidade);
						$("#uf").val(dados.uf);
					} //end if.
					else {
						//CEP pesquisado não foi encontrado.
						limpa_formulário_cep();
						alert("CEP não encontrado.");
					}
				});
			} //end if.
			else {
				//cep é inválido.
				limpa_formulário_cep();
				alert("Formato de CEP inválido.");
			}
		} //end if.
		else {
			//cep sem valor, limpa formulário.
			limpa_formulário_cep();
		}
	});
});

const telefone = document.querySelector('#telefone')

telefone.addEventListener('keypress', () => {
	let telefonelength = telefone.value.length

	if (telefonelength == 0) {
		telefone.value += '('
	} else if (telefonelength == 3) {
		telefone.value += ')'
	} else if (telefonelength == 8) {
		telefone.value += '-'
	}
})

const celular = document.querySelector('#celular')

celular.addEventListener('keypress', () => {
	let celularlength = celular.value.length

	if (celularlength == 0) {
		celular.value += '('
	} else if (celularlength == 3) {
		celular.value += ')'
	} else if (celularlength == 9) {
		celular.value += '-'
	}
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

let cancel = document.querySelector('.cancel')

cancel.addEventListener('click', () => {
	window.location.href = 'alunos_listagem'
})

function formatDate(data, formato) {
	if (formato == 'pt-br') {
		return (data.substr(0, 10).split('-').reverse().join('/'));
	} else {
		return (data.substr(0, 10).split('/').reverse().join('-'));
	}
}

function salvarAluno() {
	var id = $("#id").val();
	var nome = $("#nome").val();
	var dtnascimento = $("#dtnascimento").val();
	var formtDate = formatDate(dtnascimento)
	var email = $("#email").val();
	var cep = $("#cep").val();
	var logradouro = $("#logradouro").val();
	var complemento = $("#complemento").val();
	var bairro = $("#bairro").val();
	var cidade = $("#cidade").val();
	var uf = $("#uf").val();
	var telefone = $("#telefone").val();
	var celular = $("#celular").val();
	var cpf = $("#cpf").val();
	var rg = $("#rg").val();
	var status = $("#status").val();

	if (nome == null || nome != null && nome.trim() == '') {
		$("#nome").focus();
		alert('Informe o nome');
		return;
	}

	if (status == "Abra este menu de seleção") {
		$("#status").focus();
		alert('Selecione um item para o Status correto');
		return;
	}

	$.ajax({
		method: "POST",
		url: "aluno/salvar",
		data: JSON.stringify({
			id: id,
			nome: nome,
			dt_nasc: formtDate,
			email: email,
			cep: cep,
			logradouro: logradouro,
			complemento: complemento,
			bairro: bairro,
			localidade: cidade,
			uf: uf,
			telefone: telefone,
			celular: celular,
			cpf: cpf,
			rg: rg,
			status: status
		}),
		contentType: "application/json; charset=utf-8",
		timeout: 0,
		headers: {
			Authorization: localStorage.getItem("token")
		},
		success: function(response) {

			$("#id").val(response.id);
			const msg = "Realizando cadatro.... ";
			msgSuccess(msg);
			setTimeout(() => {
				window.location.href = 'alunos_listagem'
				document.getElementById('formCadastroAluno').reset();
			}, 3000)
		}
	}).fail(function(xhr, status, errorThrown) {
		const msg = "Error ao cadatrar.... " + xhr.responseText;
		msgError(msg);
	});
}

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
		method: "GET",
		url: "aluno/buscaralunoid",
		data: "iduser=" + id,
		timeout: 0,
		headers: {
			Authorization: localStorage.getItem("token")
		},
		success: function(response) {
			var dataFormatada = response.dt_nasc.split('-').reverse().join('/');

			$("#id").val(response.id);
			$("#nome").val(response.nome);
			$("#dtnascimento").val(dataFormatada);
			$("#email").val(response.email);
			$("#cep").val(response.cep);
			$("#logradouro").val(response.logradouro);
			$("#complemento").val(response.complemento);
			$("#bairro").val(response.bairro);
			$("#cidade").val(response.localidade);
			$("#uf").val(response.uf);
			$("#telefone").val(response.telefone);
			$("#celular").val(response.celular);
			$("#cpf").val(response.cpf);
			$("#rg").val(response.rg);
			$("#status").val(response.status);

			localStorage.removeItem('idEdit')
		}
	}).fail(function(xhr, status, errorThrown) {
		alert("Erro ao buscar usuário por id : " + xhr.responseText);
	});

}

