let localiza = document.querySelector('#localiza')

const divMessage = document.querySelector(".alert");

let totalPages = 1;

fetchNotes(0);

let tipo = '';

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

function cadastrar() {
	window.location.href = 'caixascad'
}

function edit(id) {
	localStorage.setItem('idEdit', JSON.stringify(id))
	window.location.href = 'caixascad'
}

localiza.addEventListener('keyup', () => {
	if (localiza.value != "") {
		fetchCaixa(0)
	} else {
		fetchNotes(0);
	}

})

function sair() {
	localStorage.removeItem('token')
	localStorage.removeItem('userLogado')
	window.location.href = 'login'
	eraseCookie('JSESSIONID')
}


function fetchCaixa(startPage) {

	tipo = 'caixa';

	$.ajax({
		type: "GET",
		url: "caixa/pesqcaixa?sort=id",
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
			$('#caixaTable tbody').empty();
			// add table rows
			$.each(response.content, (i, caixa) => {
				var atual = caixa.saldo;
				var valor = atual.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
				let caixaRow = '<tr>' +
					'<td >' + caixa.id + '</td>' +
					'<td id="td_nome">' + caixa.descricao +
					'<td >' + valor + '</td>' +
					'<td> <button onclick=edit(' + caixa.id + ') title="Editar"><i class="bi bi-pencil-square"></i></button>' +
					'<!--<button  onclick=ficha(' + caixa.id + ') title="Ficha"><i class="bi bi-clipboard2-data-fill"></i></button> </td>-->' +
					'</tr>';
				$('#caixaTable tbody').append(caixaRow);
			});

			if ($('ul.pagination li').length - 1 != response.totalPages) {
				// build pagination list at the first time loading
				$('ul.pagination').empty();
				buildPagination(response);
			}
		},
		error: function(e) {
			if (e.status == 403) {
				const msg = "Seu TOKEN está expirado, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO";
				msgError(msg);
				setTimeout(() => {
					sair();
				}, 5000)
			}
		}
	});
}

function fetchNotes(startPage) {
	//console.log('startPage: ' +startPage);
	/**
	 * get data from Backend's REST API
	 */
	$.ajax({
		type: "GET",
		url: "caixa/listacaixas?sort=id",
		data: {
			page: startPage,
			size: 5,
		},
		timeout: 0,
		headers: {
			Authorization: localStorage.getItem("token")
		},
		success: function(response) {
			$('#caixaTable tbody').empty();
			// add table rows
			$.each(response.content, (i, caixa) => {
				var atual = caixa.saldo;
				var valor = atual.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
				let caixaRow = '<tr>' +
					'<td >' + caixa.id + '</td>' +
					'<td id="td_nome">' + caixa.descricao +
					'<td >' + valor + '</td>' +
					'<td> <button onclick=edit(' + caixa.id + ') title="Editar"><i class="bi bi-pencil-square"></i></button>' +
					'<!--<button  onclick=ficha(' + caixa.id + ') title="Ficha"><i class="bi bi-clipboard2-data-fill"></i></button> </td>-->' +
					'</tr>';
				$('#caixaTable tbody').append(caixaRow);
			});

			if ($('ul.pagination li').length - 1 != response.totalPages) {
				// build pagination list at the first time loading
				$('ul.pagination').empty();
				buildPagination(response);
			}
		},
		error: function(e) {
			if (e.status == 403) {
				const msg = "Seu TOKEN está expirado, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO";
				msgError(msg);
				setTimeout(() => {
					sair();
				}, 5000)
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
		if (tipo == 'caixa') {
			fetchCaixa(0);
		} else {
			fetchNotes(0);
		}
		$("li.active").removeClass("active");
		// add .active to next-pagination li
		currentActive.next().addClass("active");
	} else if (val.toUpperCase() == "LAST »") {
		if (tipo == 'caixa') {
			fetchCaixa(totalPages - 1);
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
			if (tipo == 'caixa') {
				fetchCaixa(startPage);
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
			if (tipo == 'caixa') {
				fetchCaixa(startPage);
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
		if (tipo == 'caixa') {
			fetchCaixa(startPage);
		} else {
			fetchNotes(startPage);
		}
		// add focus to the li tag
		$("li.active").removeClass("active");
		$(this).parent().addClass("active");
		//$(this).addClass("active");
	}
});

function msgError(msg) {
	const message = document.createElement("div");
	message.classList.add("messageError");
	message.innerText = msg;
	divMessage.appendChild(message);

	setTimeout(() => {
		message.style.display = "none";
	}, 3000);
}
