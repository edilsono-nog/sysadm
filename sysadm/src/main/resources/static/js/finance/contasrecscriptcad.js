let userLogados = JSON.parse(localStorage.getItem("userLogado"))
let idEdit = JSON.parse(localStorage.getItem("idEdit"))
let logado = document.querySelector('#logado')
let emissao = document.querySelector('#emissao');

var dateNow = new Date();
emissao.disabled = true;

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

document.querySelector('.save').addEventListener('click', () => {

	var myHeaders = new Headers();
	myHeaders.append("Authorization", localStorage.getItem("token"));
	myHeaders.append('Content-Type', 'application/json;charset=utf-8');
	
	var emissoes = $("#emissao").val();
	var vcto = $("#vencimento").val();
	var dataFormatada = emissoes.split('/').reverse().join('-');
	var dtFormatada = vcto.split('/').reverse().join('-');

	var id = $("#id").val();
	var descricao = $("#descricao").val();
	var emissao = dataFormatada;
	var vencimento = dtFormatada;
	var observacao = $("#observacao").val();
	var valor = $("#valor").val();

	const contas = {
		id: id,
		descricao: descricao,
		emisao: emissao,
		vencimento: vencimento,
		obs: observacao,
		valor: valor,
	};
	
	$.ajax({
		method: "POST",
		url: "contasbaixasrec/salvar",
		data: JSON.stringify(contas),
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
				window.location.href = 'contasareceber'
				document.getElementById('formCadastroContasRec ').reset()
			}, 3000)
		}
	}).fail(function(xhr, status, errorThrown) {
		if (xhr.status == 403) {
			if (msg == ''){
				msg = "Seu TOKEN está expirado ou está logado em outra máquina, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO";
				fadeAviso.classList.toggle('hide')
				modalAviso.classList.toggle('hide')
				msgAviso(msg)
			}
			}else{
				const msg = "Error ao carregar contas a receber.... " + xhr.responseText;
				msgError(msg);
			}
	});
})

function limpacampos() {
	$("#id").val("");
	$("#descricao").val("");
	$("#emissao").val("");
	$("#vencimento").val("");
	$("#observacao").val("");
	$("#valor").val("");
}

function colocarEmEdicao(id) {
	
	$.ajax({
		method: "GET",
		url: "contasbaixasrec/pegaContas",
		data: "idRec=" + id,
		timeout: 0,
		headers: {
			Authorization: localStorage.getItem("token")
		},
		success: function(response) {
			var dataFormatada = response.emisao.split('-').reverse().join('/');
			var dtFormatada = response.vencimento.split('-').reverse().join('/');

			$("#id").val(response.id);
			$("#descricao").val(response.descricao);
			$("#emissao").val(dataFormatada);
			$("#vencimento").val(dtFormatada);
			$("#observacao").val(response.obs);
			$("#valor").val(response.valor);
			
			localStorage.removeItem('idEdit')
		}
	}).fail(function(xhr, status, errorThrown) {
		if (xhr.status == 403) {
			if (msg == ''){
				msg = "Seu TOKEN está expirado ou está logado em outra máquina, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO";
				fadeAviso.classList.toggle('hide')
				modalAviso.classList.toggle('hide')
				msgAviso(msg)
			}
			}else{
				const msg = "Error ao buscar contas a receber.... " + xhr.responseText;
				msgError(msg);
			}
	});
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
