let idEdit = JSON.parse(localStorage.getItem("idEdit"))
let emissao = document.querySelector('#emissao');

var dateNow = new Date();
emissao.disabled = true;

if (!Cookies.get('SysAdm')) {
	let fade = document.querySelector('#fade');
	var clicked = function() {
		window.location.href = 'login'
		fade.classList.toggle('hide')
		$.fallr.hide();
	};
	fade.classList.toggle('hide')
	$.fallr.show({
		useOverlay: false,
		zIndex: 1043,
		buttons: {
			button1: { text: 'Ok', danger: true, onclick: clicked },
		},
		content: '<p>Você precisa estar logado para acessar essa página</p>',
		position: 'center',
		icon: 'error'
	});
} else {

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
		var categoria = $('#categoria').val();
		var emissao = dataFormatada;
		var vencimento = dtFormatada;
		var observacao = $("#observacao").val();
		var valor = $("#valor").val();

		const contas = {
			id: id,
			descricao: descricao,
			categoria: categoria,
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
			if (xhr.status == 403) {
				if (msg == '') {
					msg = "Seu TOKEN está expirado ou está logado em outra máquina, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO";
					fadeAviso.classList.toggle('hide')
					modalAviso.classList.toggle('hide')
					msgAviso(msg)
				}
			} else {
				const msg = "Error ao cadastrar contas a pagar.... " + xhr.responseText;
				msgError(msg);
			}
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
				valor = Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(valor);

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
			if (xhr.status == 403) {
				if (msg == '') {
					msg = "Seu TOKEN está expirado ou está logado em outra máquina, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO";
					fadeAviso.classList.toggle('hide')
					modalAviso.classList.toggle('hide')
					msgAviso(msg)
				}
			} else {
				const msg = "Error ao buscar contas a pagar.... " + xhr.responseText;
				msgError(msg);
			}
		});
	}

	document.querySelector('.cancel').addEventListener('click', () => {
		localStorage.removeItem('idEdit');
		window.location.href = 'contasapagar';
		limpacampos();
	})

	document.querySelector('#parcelado').addEventListener('click', function() {
		var status1 = $('[name="parcelado"]:checked').val()
		if (status1 == 'on') {
			document.getElementById('qtdeparc').style.display = "block";
		} else {
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
}