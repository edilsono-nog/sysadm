let localiza = document.querySelector('#localiza')
const divMessage = document.querySelector(".alert");

let totalPages = 1;

let tipo = '';
let regParcela;

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
	
	fetchNotes(0);

	function cadastrar() {
		window.location.href = 'contasapagarcad'
	}

	function edit(id) {
		localStorage.setItem('idEdit', JSON.stringify(id))
		window.location.href = 'contasapagarcad'
	}

	localiza.addEventListener('keyup', () => {
		if (localiza.value != "") {
			fetchContasPagar(0)
		} else {
			fetchNotes(0);
		}
	})

	function fetchContasPagar(startPage) {

		tipo = 'contasapagar';

		$.ajax({
			type: "GET",
			url: "contasapagar/listacontasapagar?sort=id",
			data: {
				page: startPage,
				size: 5,
				name: localiza.value
			},
			timeout: 0,
			headers: {
				Authorization: localStorage.getItem("token")
			},
			success: function(response) {
				$('#contasTable tbody').empty();
				// add table rows
				$.each(response.content, (i, contas) => {
					var dataFormatada = contas.emissao.split('-').reverse().join('/');
					var dtFormatada = contas.vencimento.split('-').reverse().join('/');
					var atual = contas.valor;
					var valor = atual.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
					let contasRow = '<tr>' +
						'<td >' + contas.id + '</td>' +
						'<td >' + dataFormatada + '</td>' +
						'<td > ' + contas.parcelas + ' </td>' +
						'<td id="td_nome">' + contas.descricao +
						'<td >' + valor + '</td>' +
						'<td >' + dtFormatada + '</td>' +
						'<td> <button onclick=baixa(' + contas.id + ') title="Baixa de Registro">Baixar Registro</button>' +
						'<button  onclick=edit(' + contas.id + ') title="Edit"><i class="bi bi-pencil-square"></i></button> </td>' +
						'</tr>';
					$('#contasTable tbody').append(contasRow);
				});

				if ($('ul.pagination li').length - 1 != response.totalPages) {
					// build pagination list at the first time loading
					$('ul.pagination').empty();
					buildPagination(response);
				}
			},
			error: function(e) {
				if (e.status == 403) {
					if (msg == '') {
						msg = "Seu TOKEN está expirado ou está logado em outra máquina, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO";
						fadeAviso.classList.toggle('hide')
						modalAviso.classList.toggle('hide')
						msgAviso(msg)
					}
				} else {
					const msg = "Error ao carregar contas a pagar.... " + e.responseText;
					msgError(msg);
				}
			}
		});
	}

	function fetchNotes(startPage) {

		$.ajax({
			type: "GET",
			url: "contasapagar/listacontasapagar?sort=id",
			data: {
				page: startPage,
				size: 5,
				name: ""
			},
			timeout: 0,
			headers: {
				Authorization: localStorage.getItem("token")
			},
			success: function(response) {
				$('#contasTable tbody').empty();
				// add table rows
				$.each(response.content, (i, contas) => {
					var dataFormatada = contas.emissao.split('-').reverse().join('/');
					var dtFormatada = contas.vencimento.split('-').reverse().join('/');
					var atual = contas.valor;
					var valor = atual.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
					let contasRow = '<tr>' +
						'<td >' + contas.id + '</td>' +
						'<td >' + dataFormatada + '</td>' +
						'<td > ' + contas.parcelas + ' </td>' +
						'<td id="td_nome">' + contas.descricao +
						'<td >' + valor + '</td>' +
						'<td >' + dtFormatada + '</td>' +
						'<td> <button onclick=baixa(' + contas.id + ') title="Baixa de Registro">Baixar Registro</button>' +
						'<button  onclick=edit(' + contas.id + ') title="Edit"><i class="bi bi-pencil-square"></i></button> </td>' +
						'</tr>';
					$('#contasTable tbody').append(contasRow);
				});

				if ($('ul.pagination li').length - 1 != response.totalPages) {
					// build pagination list at the first time loading
					$('ul.pagination').empty();
					buildPagination(response);
				}
			},
			error: function(e) {
				if (e.status == 403) {
					if (msg == '') {
						msg = "Seu TOKEN está expirado ou está logado em outra máquina, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO";
						fadeAviso.classList.toggle('hide')
						modalAviso.classList.toggle('hide')
						msgAviso(msg)
					}
				} else {
					const msg = "Error ao carregar contas a pagar.... " + e.responseText;
					msgError(msg);
				}
			}
		});
	}

	function buildPagination(response) {
		totalPages = response.totalPages;

		var pageNumber = response.pageable.pageNumber;

		var numLinks = 5;

		// print 'previous' link only if not on page one
		var first = '';
		var prev = '';
		if (pageNumber > 0) {
			if (pageNumber != 0) {
				first = '<li class="page-item"><a class="page-link">« First</a></li>';
			}
			prev = '<li class="page-item"><a class="page-link">‹ Prev</a></li>';
		} else {
			prev = ''; // on the page one, don't show 'previous' link
			first = ''; // nor 'first page' link
		}

		// print 'next' link only if not on the last page
		var next = '';
		var last = '';
		if (pageNumber < totalPages) {
			if (pageNumber != totalPages - 1) {
				next = '<li class="page-item"><a class="page-link">Next ›</a></li>';
				last = '<li class="page-item"><a class="page-link">Last »</a></li>';
			}
		} else {
			next = ''; // on the last page, don't show 'next' link
			last = ''; // nor 'last page' link
		}

		var start = pageNumber - (pageNumber % numLinks) + 1;
		var end = start + numLinks - 1;
		end = Math.min(totalPages, end);
		var pagingLink = '';

		for (var i = start; i <= end; i++) {
			if (i == pageNumber + 1) {
				pagingLink += '<li class="page-item active"><a class="page-link"> ' + i + ' </a></li>'; // no need to create a link to current page
			} else {
				pagingLink += '<li class="page-item"><a class="page-link"> ' + i + ' </a></li>';
			}
		}

		// return the page navigation link
		pagingLink = first + prev + pagingLink + next + last;

		$("ul.pagination").append(pagingLink);
	}

	$(document).on("click", "ul.pagination li a", function() {
		var data = $(this).attr('data');
		let val = $(this).text();
		//	console.log('val: ' + val);

		// click on the NEXT tag
		if (val.toUpperCase() == "« FIRST") {
			let currentActive = $("li.active");
			if (tipo == 'contasapagar') {
				fetchContasPagar(0);
			} else {
				fetchNotes(0);
			}
			$("li.active").removeClass("active");
			// add .active to next-pagination li
			currentActive.next().addClass("active");
		} else if (val.toUpperCase() == "LAST »") {
			if (tipo == 'contasapagar') {
				fetchContasPagar(totalPages - 1);
			} else {
				fetchNotes(totalPages - 1);
			}
			$("li.active").removeClass("active");
			// add .active to next-pagination li
			currentActive.next().addClass("active");
		} else if (val.toUpperCase() == "NEXT ›") {
			let activeValue = parseInt($("ul.pagination li.active").text());
			if (activeValue < totalPages) {
				let currentActive = $("li.active");
				startPage = activeValue;
				if (tipo == 'contasapagar') {
					fetchContasPagar(startPage);
				} else {
					fetchNotes(startPage);
				}
				// remove .active class for the old li tag
				$("li.active").removeClass("active");
				// add .active to next-pagination li
				currentActive.next().addClass("active");
			}
		} else if (val.toUpperCase() === "‹ PREV") {
			let activeValue = parseInt($("ul.pagination li.active").text());
			if (activeValue > 1) {
				// get the previous page
				startPage = activeValue - 2;
				if (tipo == 'contasapagar') {
					fetchContasPagar(startPage);
				} else {
					fetchNotes(startPage);
				}
				let currentActive = $("li.active");
				currentActive.removeClass("active");
				// add .active to previous-pagination li
				currentActive.prev().addClass("active");
			}
		} else {
			startPage = parseInt(val - 1);
			if (tipo == 'contasapagar') {
				fetchContasPagar(startPage);
			} else {
				fetchNotes(startPage);
			}
			// add focus to the li tag
			$("li.active").removeClass("active");
			$(this).parent().addClass("active");
			//$(this).addClass("active");
		}
	});

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

	/*Modal Baixa*/

	let modals = document.querySelector('#modals');
	let fades = document.querySelector('#fades');

	document.getElementById("close-modal").addEventListener("click", function(event) {
		modals.classList.toggle('hide')
		fades.classList.toggle('hide')
	});

	function baixa(idRec) {
		regParcela = idRec;
		modals.classList.toggle('hide')
		fades.classList.toggle('hide')
		pegaBaixa(idRec);
	}

	$(document).ready(function() {

		pegaCaixa();
		categoriaBaixaaPagar();

	});

	function pegaCaixa() {

		$.ajax({
			method: "GET",
			url: "contasbaixasrec/pegaCaixa",
			timeout: 0,
			headers: {
				Authorization: localStorage.getItem("token")
			},
			success: function(response) {
				for (var i = 0; i < response.length; i++) {
					$('#caixa').append(
						'<option value=' + response[i].id + '>' + response[i].descricao + '</option>'
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
				const msg = "Error ao buscar caixa.... " + xhr.responseText;
				msgError(msg);
			}
		});
	}

	function categoriaBaixaaPagar() {

		let tipoSaida = 'Saida'
		let mess = '';
		let anos = '';

		$.ajax({
			method: "GET",
			url: "categorias/listacategoria?tipo=" + tipoSaida + "&mes=" + mess + "&ano=" + anos,
			timeout: 0,
			headers: {
				Authorization: localStorage.getItem("token")
			},
			success: function(response) {
				for (var i = 0; i < response.length; i++) {
					$('#categoria').append(
						'<option value=' + response[i].id + '>' + response[i].descricao + '</option>'
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
				const msg = "Error ao lista de categorias.... " + xhr.responseText;
				msgError(msg);
			}
		});
	}

	function pegaBaixa(idRec) {

		$.ajax({
			method: "GET",
			url: "contasapagar/pegaRegistro?idRec=" + idRec,
			timeout: 0,
			headers: {
				Authorization: localStorage.getItem("token")
			},
			success: function(response) {
				//var ts = new Date(response.vencimento)
				//var dataFormatada = ts.toLocaleDateString();
				var dataFormatada = response.vencimento.split('-').reverse().join('/');
				var valor = response.valor;
				valor = Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(valor);
				$("#parcela").val(response.parcelas);
				$("#descricao").val(response.descricao);
				$("#vencimento").val(dataFormatada);
				$("#valor").val(valor);
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
				const msg = "Error ao lista de contas a pagar.... " + xhr.responseText;
				msgError(msg);
			}
		});
	}

	document.querySelector('.save').addEventListener("click", function(event) {
		event.preventDefault();
		var valor = $("#valor").val();
		var valorpago = $("#valorpago").val();

		if (valorpago < valor) {
			salvarBaixa();
			var valor = valor - valorpago;
			valor = Intl.NumberFormat('en-IN', { minimumFractionDigits: 2 }).format(valor);
			$("#valor").val(valor);
			$("#valorpago").val('');
		} else {
			salvarBaixa();
			modals.classList.toggle('hide')
			fades.classList.toggle('hide')
			window.location.reload(true);
		}

	})

	function salvarBaixa() {
		var myHeaders = new Headers();
		myHeaders.append("Authorization", localStorage.getItem("token"));
		myHeaders.append('Content-Type', 'application/json;charset=utf-8');

		var dateNow = new Date();
		var dataFormatada = dateNow.toLocaleDateString();
		dataFormatada = dataFormatada.split('/').reverse().join('-');

		var id = $("#id").val();
		var categoria = $('#categoria').val();
		var parcela = $("#parcela").val();
		var dt_baixa = $("#dtpgto").val();
		var descricao = $("#descricao").val();
		var valor = $("#valorpago").val();
		var tipopgto = $("#tipopgto").val();
		var caixa = $('#caixa').val();
		var tipo = 'D';

		const baixa = {
			id: id,
			categoria: categoria,
			parcela: parcela,
			dt_baixa: dt_baixa,
			descricao: descricao,
			valor: valor,
			tipopgto: tipopgto,
			tipo: tipo,
			caixa: caixa
		};


		fetch('contasapagar/salvarBaixa?regParcela=' + regParcela, {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(baixa)
		})
			.then(response => {
				return response.json();
			})
			.then(result => {
				$("#id").val(result.id);
				const msg = "Realizando cadatro.... ";
				msgSuccess(msg);
				/*setTimeout(() => {
					window.location.href = 'caixas'
					document.getElementById('formCadastroCaixa ').reset();
				}, 3000)*/
			})
			.catch(error => {
				console.log(error);
			});
	}

	function formatarMoeda() {
		var elemento = document.getElementById('valorpago');
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
}