let userLogados = JSON.parse(localStorage.getItem("userLogado"))

let idEdit = JSON.parse(localStorage.getItem("idEdit"))

let logado = document.querySelector('#logado')

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
		window.location.href = 'anoletivo'
	})

	document.querySelector('.save').addEventListener('click', () => {
		var id = $("#id").val();
		var anoletivo = $("#anoletivo").val();

		if (anoletivo == null || anoletivo != null && anoletivo.trim() == '') {
			$("#anoletivo").focus();
			alert('Informe o Ano Letivo');
			return;
		}


		$.ajax({
			method: "POST",
			url: "anoletivo/salvar",
			data: JSON.stringify({
				id: id,
				ano: anoletivo
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
					window.location.href = 'anoletivo'
					document.getElementById('formCadastroAnoLetivo').reset();
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
				const msg = "Error ao cadatrar.... " + xhr.responseText;
				msgError(msg);
			}
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
			method: "GET",
			url: "anoletivo/buscaranoid",
			data: "idano=" + id,
			timeout: 0,
			headers: {
				Authorization: localStorage.getItem("token")
			},
			success: function(response) {

				$("#id").val(response.id);
				$("#anoletivo").val(response.ano);


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
				alert("Erro ao buscar anoletivo por id : " + xhr.responseText);
			}
		});
	}
}
