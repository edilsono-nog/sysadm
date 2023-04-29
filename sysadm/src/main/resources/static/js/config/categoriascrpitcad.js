let idEdit = JSON.parse(localStorage.getItem("idEdit"))

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
	}

	document.querySelector('.cancel').addEventListener('click', () => {
		localStorage.removeItem('idEdit');
		window.location.href = 'categoriaslist';
		limpacampos();
	})

	function limpacampos() {
		$("#id").val("");
		$("#descricao").val("");
		$("#tipo").load;
	}

	document.querySelector('.save').addEventListener('click', () => {

		var id = $("#id").val();
		var descricao = $("#descricao").val();
		var tipo = $("#tipo").val();

		if (descricao == null || descricao != null && descricao.trim() == '') {
			$("#descricao").focus();
			alert('Informe a descricao');
			return;
		}

		if (tipo == "Selecione...") {
			$("#tipo").focus();
			alert('Selecione um item para o Tipo correto');
			return;
		}

		$.ajax({
			method: "POST",
			url: "categorias/salvar",
			data: JSON.stringify({
				id: id,
				descricao: descricao,
				tipo: tipo,
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
					window.location.href = 'categoriaslist'
					document.getElementById('formCadastroCategoria').reset();
				}, 3000)
				limpacampos();
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
				const msg = "Error ao cadatrar.... " + xhr.responseText;
				msgError(msg);
			}
		});
	})

	function colocarEmEdicao(id) {

		$.ajax({
			method: "GET",
			url: "categorias/buscarcategoriaid",
			data: "idCategoria=" + id,
			timeout: 0,
			headers: {
				Authorization: localStorage.getItem("token")
			},
			success: function(response) {

				$("#id").val(response.id);
				$("#descricao").val(response.descricao);
				$("#tipo").val(response.tipo);

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
				alert("Erro ao buscar categorias : " + xhr.responseText);
			}
		});
	}
}