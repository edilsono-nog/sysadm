let idEdit = JSON.parse(localStorage.getItem("idEdit"))
let emissao = document.querySelector('#emissao');

var dateNow = new Date();
emissao.disabled = true;

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

if (idEdit != null) {
	colocarEmEdicao(idEdit);
} else {
	idEdit = '';
	$("#emissao").val(dateNow.toLocaleDateString()); 
}

document.querySelector('.save').addEventListener('click', () => {

	var emissoes = $("#emissao").val();
	var vcto = $("#vencimento").val();
	var dataFormatada = emissoes.split('/').reverse().join('-');
	var dtFormatada = vcto.split('/').reverse().join('-');
	var parcelas = $('#qtdeparcelas').val();
	var id = $("#id").val();
	var descricao = $("#descricao").val();
	var emissao = dataFormatada;
	var vencimento = dtFormatada;
	var observacao = $("#observacao").val();
	var valor = $("#valor").val();

	const contas = {
		id: id,
		descricao: descricao,
		emissao: emissao,
		parcelas: parcelas,
		vencimento: vencimento,
		obs: observacao,
		valor: valor,
	};
	
	$.ajax({
		method: "POST",
		url: "contasapagar/salvar",
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
				window.location.href = 'contasapagar'
				document.getElementById('formCadastroContasaPagar').reset()
			}, 3000)
		}
	}).fail(function(xhr, status, errorThrown) {
		const msg = "Error ao cadatrar.... " + xhr.responseText;
	});
})

function colocarEmEdicao(id) {
	
	$.ajax({
		method: "GET",
		url: "contasapagar/pegaContas",
		data: "idRec=" + id,
		timeout: 0,
		headers: {
			Authorization: localStorage.getItem("token")
		},
		success: function(response) {
			var dataFormatada = response.emissao.split('-').reverse().join('/');
			var dtFormatada = response.vencimento.split('-').reverse().join('/');
			
			var valor = response.valor;
			valor = Intl.NumberFormat('en-IN',{ minimumFractionDigits: 2}).format(valor);

			$("#id").val(response.id);
			$("#descricao").val(response.descricao);
			$("#emissao").val(dataFormatada);
			$("#qtdeparcelas").val(response.parcelas);
			$("#vencimento").val(dtFormatada);
			$("#observacao").val(response.obs);
			$("#valor").val(valor);
			
			localStorage.removeItem('idEdit')
		}
	}).fail(function(xhr, status, errorThrown) {
		alert("Erro ao buscar usuário por id : " + xhr.responseText);
	});

}

document.querySelector('.cancel').addEventListener('click', () => {
	localStorage.removeItem('idEdit');
	window.location.href = 'contasapagar';
	limpacampos();
})

document.querySelector('#parcelado').addEventListener('click', function(){
	var status1 = $('[name="parcelado"]:checked').val()
	if(status1 == 'on'){
		document.getElementById('qtdeparc').style.display = "block";
	}else{
		document.getElementById('qtdeparc').style.display = "none";
	}
	
})

function limpacampos() {
	$("#id").val("");
	$("#descricao").val("");
	$("#emissao").val("");
	$("#qtdeparcelas").val("");
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