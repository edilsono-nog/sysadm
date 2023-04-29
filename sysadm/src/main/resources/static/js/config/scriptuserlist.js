let userLogados = JSON.parse(localStorage.getItem("userLogado"))
let logado = document.querySelector('#logado')
let localiza = document.querySelector('#localiza')

let totalPages = 1;

let tipo = '';

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

	localiza.addEventListener('keyup', () => {
		if (localiza.value != "") {
			fetchaUsuario(0)
		} else {
			fetchNotes(0);
		}

	})

	function cadastrar() {
		window.location.href = 'usuarioscad'
	}

	function edit(id) {
		localStorage.setItem('idEdit', JSON.stringify(id))
		window.location.href = 'usuarioscad'
	}


	function fetchaUsuario(startPage) {

		tipo = 'users';

		$.ajax({
			type: "GET",
			url: "usuario/pesqUsuario?sort=id",
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
				$('#usuariosTable tbody').empty();
				// add table rows
				$.each(response.content, (i, user) => {
					for (var i = 0; i < user.authorities.length; i++) {
						var descricao = user.authorities[i].descricao;
					}
					let userRow = '<tr>' +
						'<td >' + user.id + '</td>' +
						'<td id="td_nome">' + user.nome +
						'<p style="font-size: 11px; margin-top: 5px;" >' + user.email + '</p></td>' +
						'<td >' + user.cpf + '</td>' +
						'<td >' + descricao + '</td>' +
						'<td> <button onclick=edit(' + user.id + ') title="Editar"><i class="bi bi-pencil-square"></i></button>' +
						'<!--<button  onclick=ficha(' + user.id + ') title="Ficha"><i class="bi bi-clipboard2-data-fill"></i></button> </td>-->' +
						'</tr>';
					$('#usuariosTable tbody').append(userRow);
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
					const msg = "Error ao cadatrar.... " + e.responseText;
					msgError(msg);
				}
			}
		});
	}

	function fetchNotes(startPage) {
		$.ajax({
			type: "GET",
			url: "usuario/listatodos?sort=id",
			data: {
				page: startPage,
				size: 5,
			},
			timeout: 0,
			headers: {
				Authorization: localStorage.getItem("token")
			},
			success: function(response) {
				$('#usuariosTable tbody').empty();
				// add table rows
				$.each(response.content, (i, user) => {
					for (var i = 0; i < user.authorities.length; i++) {
						var descricao = user.authorities[i].descricao;
					}
					let userRow = '<tr>' +
						'<td >' + user.id + '</td>' +
						'<td id="td_nome">' + user.nome +
						'<p style="font-size: 11px; margin-top: 5px;" >' + user.email + '</p></td>' +
						'<td >' + user.cpf + '</td>' +
						'<td >' + descricao + '</td>' +
						'<td> <button onclick=edit(' + user.id + ') title="Editar"><i class="bi bi-pencil-square"></i></button>' +
						'<!--<button  onclick=ficha(' + user.id + ') title="Ficha"><i class="bi bi-clipboard2-data-fill"></i></button> </td>-->' +
						'</tr>';
					$('#usuariosTable tbody').append(userRow);
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
					const msg = "Error ao cadatrar.... " + e.responseText;
					msgError(msg);
				}
				alert("ERROR: ", e);
				console.log("ERROR: ", e);
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
			if (tipo == 'users') {
				fetchUsuario(0);
			} else {
				fetchNotes(0);
			}
			$("li.active").removeClass("active");
			// add .active to next-pagination li
			currentActive.next().addClass("active");
		} else if (val.toUpperCase() == "LAST »") {
			if (tipo == 'users') {
				fetchUsuario(totalPages - 1);
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
				if (tipo == 'users') {
					fetchUsuario(startPage);
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
				if (tipo == 'users') {
					fetchUsuario(startPage);
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
			if (tipo == 'users') {
				fetchUsuario(startPage);
			} else {
				fetchNotes(startPage);
			}
			// add focus to the li tag
			$("li.active").removeClass("active");
			$(this).parent().addClass("active");
			//$(this).addClass("active");
		}
	});
}