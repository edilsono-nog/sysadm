

let totalPages = 1;

let tipo = '';

let categorias = [];

if (getCookie('JSESSIONID') == null) {
    alert('Você precisa estar logado para acessar essa página')
    window.location.href = 'login'
}

function getCookie(nome) {
    var nomeCookie = nome + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nomeCookie) == 0) return c.substring(nomeCookie.length,c.length);
    }
    return null;
}

function eraseCookie(nome) {   
    document.cookie = nome +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function pegaPainel(){
	
	$.ajax({
		type: "GET",
		url: "dashboard/painel",
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
			if (msg == ''){
				msg = "Seu TOKEN está expirado ou está logado em outra máquina, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO";
				fadeAviso.classList.toggle('hide')
				modalAviso.classList.toggle('hide')
				msgAviso(msg)
			}
			}
	});
}

function pegaBaixas(startPage) {
	
	tipo = 'baixas';
	
	$.ajax({
		type: "GET",
		url: "dashboard/buscaBaixas",
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
			}
		}
	}).fail(function(xhr, status, errorThrown) {
		if (xhr.status == 403) {
			if (msg == ''){
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
			pegaBaixas(0);
		} else {
			fetchNotes(0);
		}
		$("li.active").removeClass("active");
		// add .active to next-pagination li
		currentActive.next().addClass("active");
	} else if (val.toUpperCase() == "LAST »") {
		if (tipo == 'baixas') {
			pegaBaixas(totalPages - 1);
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
				pegaBaixas(startPage);
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
				pegaBaixas(startPage);
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
			pegaBaixas(startPage);
		} else {
			fetchNotes(startPage);
		}
		// add focus to the li tag
		$("li.active").removeClass("active");
		$(this).parent().addClass("active");
		//$(this).addClass("active");
	}
});


$(document).ready(function () {
	pegaBaixas(0);
	pegaPainel();
});

function sair(){
    localStorage.removeItem('token')
    localStorage.removeItem('userLogado')
    window.location.href = 'login'
    eraseCookie('JSESSIONID')
}
