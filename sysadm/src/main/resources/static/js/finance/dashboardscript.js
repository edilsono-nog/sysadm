var data = new Date();
var mes = String(data.getMonth() + 1).padStart(1, '0');
var mespesquisa = mes;
var ano = String(data.getFullYear()).padStart(4, '0');
var anopesquisa = ano;

let totalPages = 1;

let tipo = '';

var pgmes = '';
var pgano = '';

let categorias = [];

let etiquetas = [];
let valores = [];
let etiquetasMedia = [];
let valoresMedia = [];

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

	$(document).ready(function() {
		autAno();
		$('#mesrefer').val(mespesquisa);
		pegaBaixas(0, mespesquisa, anopesquisa);
		pegaPainel(mespesquisa, anopesquisa);
		categoriaPainel(mespesquisa, anopesquisa);
		categoriaPainelMedia();
		preecher();
		preecherAnt();
	});

	document.querySelector('#mesrefer').addEventListener('change', () => {
		mespesquisa = $('#mesrefer').val();
		anopesquisa = $('#selectAno').val();
		categoriaPainel(mespesquisa, anopesquisa);
		pegaBaixas(0, mespesquisa, anopesquisa);
		pegaPainel(mespesquisa, anopesquisa);
	})

	document.querySelector('#selectAno').addEventListener('change', () => {
		mespesquisa = $('#mesrefer').val();
		anopesquisa = $('#selectAno').val();
		categoriaPainel(mespesquisa, anopesquisa);
		pegaBaixas(0, mespesquisa, anopesquisa);
		pegaPainel(mespesquisa, anopesquisa);
	})

	function pegaPainel(mespesq, anopesq) {

		$.ajax({
			type: "GET",
			url: "dashboard/painel?mes=" + mespesq + "&anoletivo=" + anopesq,
			timeout: 0,
			headers: {
				Authorization: localStorage.getItem("token")
			},
			success: function(response) {
				var mensalidades = response.ttl_mensalidades;
				mensalidades = mensalidades.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
				var recebidos = response.ttl_recebido;
				recebidos = recebidos.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
				var saldo = response.saldo;
				saldo = saldo.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
				document.querySelector('#matriculados').innerHTML = response.matriculados;
				document.querySelector('#mensalidades').innerHTML = mensalidades;
				document.querySelector('#recebidos').innerHTML = recebidos;
				document.querySelector('#saldo').innerHTML = saldo;
			}
		}).fail(function(xhr, status, errorThrown) {
			if (xhr.status == 403) {
				if (msg == '') {
					msg = "Seu TOKEN está expirado ou está logado em outra máquina, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO";
					fadeAviso.classList.toggle('hide')
					modalAviso.classList.toggle('hide')
					msgAviso(msg)
				}
			}
		});
	}

	function pegaBaixas(startPage, mespesq, anopesq) {

		pgmes = mespesq;
		pgano = anopesq;

		tipo = 'baixas';

		$.ajax({
			type: "GET",
			url: "dashboard/buscaBaixas?mes=" + mespesq + "&anoletivo=" + anopesq,
			data: {
				page: startPage,
				size: 5,
			},
			timeout: 0,
			headers: {
				Authorization: localStorage.getItem("token")
			},
			success: function(response) {
				$('#baixasTable tbody').empty();
				// add table rows
				$.each(response.content, (i, baixas) => {
					var dataFormatada = baixas.dt_baixa.split('-').reverse().join('/');
					var atual = baixas.valor;
					var valor = atual.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
					let baixasRow = '<tr>' +
						'<td >' + dataFormatada + '</td>' +
						'<td >' + baixas.parcela +
						'<td style="text-align: left;">' + baixas.descricao + '</td>' +
						'<td >' + baixas.tipopgto + '</td>' +
						'<td >' + valor + '</td>' +
						'<td >' + baixas.tipo + '</td>' +
						'</tr>';
					$('#baixasTable tbody').append(baixasRow);
				});
				if ($('ul.pagination li').length - 1 != response.totalPages) {
					$('ul.pagination').empty();
					buildPagination(response);
				} else {
					$('ul.pagination').empty();
					buildPagination(response);
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
			if (tipo == 'baixas') {
				pegaBaixas(0, pgmes, pgano);
			} else {
				fetchNotes(0);
			}
			$("li.active").removeClass("active");
			// add .active to next-pagination li
			currentActive.next().addClass("active");
		} else if (val.toUpperCase() == "LAST »") {
			if (tipo == 'baixas') {
				pegaBaixas(totalPages - 1, pgmes, pgano);
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
				if (tipo == 'baixas') {
					pegaBaixas(startPage, pgmes, pgano);
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
				if (tipo == 'baixas') {
					pegaBaixas(startPage, pgmes, pgano);
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
			if (tipo == 'baixas') {
				pegaBaixas(startPage, pgmes, pgano);
			} else {
				fetchNotes(startPage);
			}
			// add focus to the li tag
			$("li.active").removeClass("active");
			$(this).parent().addClass("active");
			//$(this).addClass("active");
		}
	});

	function categoriaPainel(mespesquisa, anopesquisa) {
		let tipocat = ''
		etiquetas = [];
		valores = [];

		var myHeaders = new Headers();
		myHeaders.append("Authorization", localStorage.getItem("token"));
		myHeaders.append('Content-Type', 'application/json;charset=utf-8');

		fetch("categorias/listacategoria?tipo=" + tipocat + "&ano=" + anopesquisa + "&mes=" + mespesquisa, {
			method: 'GET',
			headers: myHeaders
		})
			.then(response => {
				return response.json();
			})
			.then(result => {
				for (var i = 0; i < result.length; i++) {
					etiquetas.push(result[i][0])
					valores.push(result[i][1])
				}
				preecher();
			})
			.catch(error => {
				console.log(error);
			});
	}

	function categoriaPainelMedia() {

		$.ajax({
			method: "GET",
			url: "categorias/listacategoriaMedia",
			timeout: 0,
			headers: {
				Authorization: localStorage.getItem("token")
			},
			success: function(response) {
				for (var i = 0; i < response.length; i++) {
					etiquetasMedia.push(response[i][0])
					valoresMedia.push(response[i][1])
				}
				preecherAnt();
			}
		}).fail(function(xhr, status, errorThrown) {
			if (xhr.status == 403) {
				if (msg == '') {
					msg = "Seu TOKEN está expirado ou está logado em outra máquina, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO";
					fadeAviso.classList.toggle('hide')
					modalAviso.classList.toggle('hide')
					msgAviso(msg)
				}
			}
		});
	}

	const ctx = document.getElementsByClassName('chartAtual');

	const myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			datasets: [{
				label: "Mes Atual",
				backgroundColor: [
					"rgb(255, 99, 132, 0.2)",
					"rgba(54, 162, 235, 0.2)",
					"rgba(255, 206, 86, 0.2)",
					"rgba(47, 100, 100, 0.2)",
					"rgba(153, 102, 255, 0.2)",
					"rgba(255, 159, 64, 0.2)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(47, 100, 100, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
				],
				borderWidth: 2,
			}]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			}
		},
	})

	function preecher() {
		myChart.data.datasets[0].data = valores;
		myChart.data.labels = etiquetas;
		myChart.update();
	}

	const ctxAnt = document.getElementsByClassName('chartAnteriores');

	const myChartAnt = new Chart(ctxAnt, {
		type: 'bar',
		data: {
			datasets: [{
				label: "Médias dos meses",
				backgroundColor: [
					"rgb(255, 99, 132, 0.2)",
					"rgba(54, 162, 235, 0.2)",
					"rgba(255, 206, 86, 0.2)",
					"rgba(47, 100, 100, 0.2)",
					"rgba(153, 102, 255, 0.2)",
					"rgba(255, 159, 64, 0.2)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(47, 100, 100, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
				],
				borderWidth: 2,
			}]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			}
		},
	})

	function preecherAnt() {
		myChartAnt.data.datasets[0].data = valoresMedia;
		myChartAnt.data.labels = etiquetasMedia;
		myChartAnt.update();
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
				$('#selectAno').val(anopesquisa);
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
}

