let userLogados = JSON.parse(localStorage.getItem("userLogado"))

let idFicha = JSON.parse(localStorage.getItem("idFicha"))
let idFichaAluno = JSON.parse(localStorage.getItem("idFichaAluno"))

let logado = document.querySelector('#logado')

let idAluno = "";
let idMat = "";

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

	if (idFicha != null && idFicha == idFichaAluno || idFichaAluno == null) {
		autFicha(idFicha);
	} else {
		autFicha(idFichaAluno);
		localStorage.removeItem('idFichaAluno')
	}

	document.querySelector('#voltar').addEventListener('click', () => {
		localStorage.removeItem('idFicha')
		localStorage.removeItem('idFichaAluno')
		window.location.href = 'alunos_listagem'
	})

	function autFicha(id) {

		$.ajax({
			method: "GET",
			url: "aluno/buscaralunoid",
			data: "iduser=" + id,
			timeout: 0,
			headers: {
				Authorization: localStorage.getItem("token")
			},
			success: function(response) {
				if (response.dt_nasc != null) {
					var dataFormatada = response.dt_nasc.split('-').reverse().join('/');
				} else {
					dataFormatada = '';
				}

				document.querySelector('.id').innerHTML = response.id;
				idAluno = response.id;
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

				response.matricula.sort(function(x, y) {
					return x.anoletivo - y.anoletivo;
				})

				$('#matriculaTable > tbody > tr').remove();
				// add table rows
				for (var i = 0; i < response.matricula.length; i++) {
					$('#matriculaTable > tbody').append(
						'<tr>' +
						'<td ">' + response.matricula[i].anoletivo + '</td>' +
						'<td >' + response.matricula[i].escolas + '</td>' +
						'<td >' + response.matricula[i].turma + '</td>' +
						'<td > ' + response.matricula[i].turno + '</td>' +
						'<td ><button  onclick=edit(' + response.matricula[i].id + ') title="Edita Matricula" style="margin-right: 10px;"><i class="bi bi-pencil-square"></i></button>' +
						'<button  onclick="openModalMensalidade(' + response.matricula[i].anoletivo + ')" title="Mensalidades"><i class="bi bi-cash-coin"></i></button></td>' +
						'</tr>');
				}

				response.responsaveis.sort(function(x, y) {
					return x.id - y.id;
				})

				for (var i = 0; i < response.responsaveis.length; i++) {
					$('#responsavelTable > tbody').append(
						'<tr>' +
						'<td>' + response.responsaveis[i].nome + '</td>' +
						'<td>' + response.responsaveis[i].celular + '</td>' +
						'<td>' + response.responsaveis[i].tipo + '</td>' +
						'<td><!--<button class="btn" onclick=edit(' + response.responsaveis[i].id + ') title="Dados Responsável"><i class="fa-solid fa-pen-to-square"></i></button>-->' +
						'<button  onclick=ficha(' + response.responsaveis[i].id + ') title="Dados Responsável"><i class="bi bi-person-lines-fill"></i></button> </td>' +
						'</tr>');
				}
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
				alert("Erro ao buscar usuário por id : " + xhr.responseText);
			}
		});

	}

	function ficha(id) {
		localStorage.setItem('idFichaResp', JSON.stringify(id))
		window.location.href = 'responsavel_ficha'
	}

	/*Modal Mensalidades*/

	let modalMensalidade = document.querySelector('#modalMensalidade');
	let fadeMensalidade = document.querySelector('#fadeMensalidade');

	var clicked1 = false;

	const toggleModalMens = () => {
		[modalMensalidade, fadeMensalidade].forEach((els) => {
			els.classList.toggle("hide")
		});
	}

	document.getElementById("closemodalMensalidade").addEventListener("click", function(event) {
		modalMensalidade.classList.toggle('hide')
		fadeMensalidade.classList.toggle('hide')
	});

	document.getElementById("novoResponsavel").addEventListener("click", function(event) {
		window.location.href = 'responsavel_listagem'
	});

	function verificaStatusMens() {
		if (clicked1) {
			clicked1 = false;
		} else {
			clicked1 = true;
		}
	}

	/*Modal Mensalidades*/

	let gerar = document.querySelector('#gerarMensalidade');
	let exclui = document.querySelector('#excluirMensalidade');
	gerar.disabled = true;
	excluirMensalidade = false;

	const openModalMensalidade = (anoletivo) => {
		modalMensalidade.classList.toggle('hide')
		fadeMensalidade.classList.toggle('hide')
		autDados(anoletivo);
	}

	let aluno = '';
	let ano = '';

	function autDados(anoletivo) {
		aluno = document.querySelector('#labelMatriculaAluno').innerHTML = idAluno;
		ano = document.querySelector('#labelAnoLetivo').innerHTML = anoletivo;
		autMensalidades(aluno, ano);
	}

	function formatDate(data, formato) {
		if (formato == 'pt-br') {
			return (data.substr(0, 10).split('-').reverse().join('/'));
		} else {
			return (data.substr(0, 10).split('/').reverse().join('-'));
		}
	}

	gerar.addEventListener("click", function(event) {
		gerarMensalidade();
	});

	document.querySelector('#excluirMensalidade').addEventListener('click', function() {
		limpaMensalidade();
	});

	function gerarMensalidade() {
		var responsavel = $("#selectfinanceiro").val();
		var dtvencimento = $("#dtvencimento").val();
		var valor = $("#valor").val();
		var parcelas = $("#parcelas").val();

		if (responsavel == 'Selecione...') {
			responsavel = '';
		}


		$.ajax({
			method: "POST",
			url: "mensalidade/incMensalidade",
			data: JSON.stringify({
				idAluno: aluno,
				anoletivo: ano,
				valor: valor,
				parcelas: parcelas,
				vencimento: dtvencimento,
				responsavel: responsavel
			}),
			contentType: "application/json; charset=utf-8",
			timeout: 0,
			headers: {
				Authorization: localStorage.getItem("token")
			},
			success: function(response) {

				$("#id").val(response.id);
				const msg = "Gerando mensalidades.... ";
				msgSuccess(msg);
				setTimeout(() => {
					autMensalidades(aluno, ano);
					limpa();
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
	}

	function limpaMensalidade() {

		$.ajax({
			method: "DELETE",
			url: "mensalidade/removeparcelas?idAluno=" + aluno + "&anoletivo=" + ano,
			contentType: "application/json; charset=utf-8",
			timeout: 0,
			headers: {
				Authorization: localStorage.getItem("token")
			},
			success: function(response) {

				$("#id").val(response.id);
				const msg = "Removendo parcelas.... ";
				msgSuccess(msg);
				setTimeout(() => {
					autMensalidades(aluno, ano);
					limpa();
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
	}

	function autMensalidades(aluno, ano) {

		let cabecario = document.querySelector('.cabecario')
		let tabelaParcelas = document.querySelector('.tabelaParcelas')
		let modalMensalidade = document.querySelector('#modalMensalidade')
		let closemodalMensalidade = document.querySelector('#closemodalMensalidade')
		let excluirMensalidade = document.querySelector('#excluirMensalidade')

		$.ajax({
			method: "GET",
			url: "mensalidade/listamensalidades?idAluno=" + aluno + "&anoletivo=" + ano,
			timeout: 0,
			headers: {
				Authorization: localStorage.getItem("token")
			},
			success: function(response) {
				if (response.length == 0) {
					gerar.disabled = false;
					exclui.disabled = true;
					cabecario.setAttribute('style', 'display: block;')
					tabelaParcelas.setAttribute('style', 'display: none;')
					modalMensalidade.setAttribute('style', 'height: 50%')
					closemodalMensalidade.setAttribute('style', 'margin-top: 2%')
					excluirMensalidade.setAttribute('style', 'display: none;')
				} else {
					gerar.disabled = true;
					exclui.disabled = false;
					cabecario.setAttribute('style', 'display: none;')
					tabelaParcelas.setAttribute('style', 'display: blobk;')
					modalMensalidade.setAttribute('style', 'height: 80%')
					closemodalMensalidade.setAttribute('style', 'margin-top: 11%')
					excluirMensalidade.setAttribute('style', 'display: block;')
				}

				response.sort(function(x, y) {
					return x.id - y.id;
				})
				$('#tableMensalidades > tbody > tr').remove();
				// add table rows
				for (var i = 0; i < response.length; i++) {
					var dataFormatada = response[i][6].split('-').reverse().join('/');
					var ts = new Date(response[i][6]);
					var atual = response[i][5];
					var valor = atual.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
					//console.log(ts.toLocaleDateString());

					$('#tableMensalidades > tbody').append(
						'<tr>' +
						'<td id="aluno">' + response[i][4] + '</td>' +
						'<td id="venc">' + dataFormatada + '</td>' +
						'<td>' + valor + '</td>' +
						'<td id="respfin">' + response[i][9] + '</td>' +
						'<td>' +
						'</tr>');
				}
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
				alert("Erro ao buscar aluno por id : " + xhr.responseText);
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
			valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
		}

		elemento.value = valor;
		if (valor == 'NaN') elemento.value = '';
	}

	function limpa() {
		$("#labelMatriculaAluno").val('');
		$("#labelAnoLetivo").val('');
		$("#selectfinanceiro").val('');
		$("#dtvencimento").val('');
		$("#valor").val('');
		$("#parcelas").val('');
	}


	/*Modal Matricula*/
	let modals = document.querySelector('#modals');
	let fades = document.querySelector('#fades');

	document.getElementById("novoMatricula").addEventListener("click", function(event) {
		modals.classList.toggle('hide')
		fades.classList.toggle('hide')
		autAno();
		autEscolas();
	});

	document.getElementById("close-modal").addEventListener("click", function(event) {
		modals.classList.toggle('hide')
		fades.classList.toggle('hide')
		window.location.reload(true);
	});

	document.getElementById("salvaMatricula").addEventListener("click", function(event) {
		salvaMatricula()
		event.preventDefault();
		setTimeout(() => {
			modals.classList.toggle('hide')
			fades.classList.toggle('hide')
			window.location.reload(true);
		}, 3000)

	});

	const edit = (id) => {
		modals.classList.toggle('hide')
		fades.classList.toggle('hide')
		autAno();
		autEscolas();
		pegaMatricula(id)
	}


	function autAno() {

		$.ajax({
			method: "GET",
			url: "anoletivo/listaAno",
			timeout: 0,
			headers: {
				Authorization: localStorage.getItem("token")
			},
			success: function(response) {
				for (var i = 0; i < response.length; i++) {
					$('#selectAno').append(
						'<option value=' + response[i].ano + '>' + response[i].ano + '</option>'
					);
				}
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
				alert("Erro ao atualizar lita anoletivo: " + xhr.responseText);
			}
		});
	}

	function autEscolas() {

		$.ajax({
			method: "GET",
			url: "escolas/listaEscola",
			timeout: 0,
			headers: {
				Authorization: localStorage.getItem("token")
			},
			success: function(response) {
				for (var i = 0; i < response.length; i++) {
					$('#selectEscola').append(
						'<option value=' + response[i].escola + '>' + response[i].escola + '</option>'
					);
				}
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
				alert("Erro ao atualizar lita anoletivo: " + xhr.responseText);
			}
		})
	}


	function salvaMatricula() {

		var anoletivo = $("#selectAno ").val();
		var turma = $("#turma").val();
		var turno = $("#selectTurno").val();

		var select = document.getElementById('selectEscola');
		var escolas = select.options[select.selectedIndex].text;

		$.ajax({
			method: "POST",
			url: "matricula/salvar?idAluno=" + idAluno,
			data: JSON.stringify({
				id: idMat,
				aluno: idAluno,
				anoletivo: anoletivo,
				escolas: escolas,
				turma: turma,
				turno: turno
			}),
			contentType: "application/json; charset=utf-8",
			timeout: 0,
			headers: {
				Authorization: localStorage.getItem("token")
			},
			success: function(response) {
				localStorage.setItem('idFichaAluno', JSON.stringify(idAluno))
				const msg = "Realizando Matricula .... ";
				msgSuccess(msg);

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
				alert("Erro ao cadastrar matricula: " + xhr.responseText);
			}
		});
	}

	function pegaMatricula(id) {

		$.ajax({
			method: "GET",
			url: "matricula/buscarmatriculaid",
			data: "idmatricula=" + id,
			timeout: 0,
			headers: {
				Authorization: localStorage.getItem("token")
			},
			success: function(response) {
				idMat = response.id;
				$("#selectAno").val(response.anoletivo);
				$("#selectEscola option:selected").text(response.escolas);
				$("#turma").val(response.turma);
				$("#selectTurno").val(response.turno);
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
				alert("Erro ao buscar matricula por id : " + xhr.responseText);
			}
		});
	}

	let divMsg = document.querySelector(".alert");

	function msgSuccess(msg) {
		const message = document.createElement("div");
		message.classList.add("messageSucesso");
		message.innerText = msg;
		divMsg.appendChild(message);

		setTimeout(() => {
			message.style.display = "none";
		}, 3000);
	}

	function msgError(msg) {
		const message = document.createElement("div");
		message.classList.add("messageError");
		message.innerText = msg;
		divMsg.appendChild(message);

		setTimeout(() => {
			message.style.display = "none";
		}, 3000);
	}
}