let userLogados = JSON.parse(localStorage.getItem("userLogado"))
let logado = document.querySelector('#logado')
let localiza = document.querySelector('#localiza')
const divMessage = document.querySelector(".alert");
var radios = document.getElementsByName("fav_language");

let totalPages = 1;

fetchNotes(0);

let tipo = '';
let tipoRadio;
let tipoRadios;
let regParcela;
let tipoService;

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
	window.location.href = 'contasarecebercad'
}

function edit(id) {
	localStorage.setItem('idEdit', JSON.stringify(id))
	window.location.href = 'contasarecebercad'
}

localiza.addEventListener('keyup', () => {
	if (localiza.value != "") {
		fetchContasRec(0)
	} else {
		fetchNotes(0);
	}
})

document.querySelector('.radios').addEventListener('click', () => {
	fetchNotes(0);
	$("#localiza").val("");
})
document.querySelector('.radioss').addEventListener('click', () => {
	fetchNotes(0);
	$("#localiza").val("");
})

function sair() {
	localStorage.removeItem('token')
	localStorage.removeItem('userLogado')
	window.location.href = 'login'
	eraseCookie('JSESSIONID')
}


function fetchContasRec(startPage) {

	tipo = 'contasrec';
	var url = '';
	var tipos = '';

	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			if (radios[i].value == 'mensalidade') {
				url = "contasbaixasrec/listamensalidades?sort=id"
				tipos = radios[i].value;
			} else {
				url = "contasbaixasrec/listacontas?sort=id"
				tipos = radios[i].value;
			}
		}
	}
	
	$.ajax({
		type: "GET",
		url: url,
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
			if (tipos == 'mensalidade') {
				tipoRadio = 'mensalidade';
				$('#contasTable tbody').empty();
				// add table rows
				$.each(response.content, (i, contas) => {
					var dataFormatada = contas[2].split('-').reverse().join('/');
					var dtFormatada = contas[6].split('-').reverse().join('/');
					var ts = new Date(contas[2])
					var sts = new Date(contas[6])
					var atual = contas[5];
					var valor = atual.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
					let contasRow = '<tr>' +
						'<td >' + contas[0] + '</td>' +
						'<td >' + dataFormatada + '</td>' +
						'<td >' + contas[4] + '</td>' +
						'<td id="td_nome">' + contas[9] +
						'<td >' + valor + '</td>' +
						'<td >' + dtFormatada + '</td>' +
						'<td> <button onclick=baixa(' + contas[0] + ') title="Editar">Baixar Registro</button>' +
						'<!--<button  onclick=ficha(' + contas[0] + ') title="Baixa"><i class="bi bi-clipboard2-data-fill"></i></button> </td>-->' +
						'</tr>';
					$('#contasTable tbody').append(contasRow);
				});

				if ($('ul.pagination li').length - 1 != response.totalPages) {
					// build pagination list at the first time loading
					$('ul.pagination').empty();
					buildPagination(response);
				}
			}
			if (tipos == 'outros') {
				tipoRadio = 'outros';
				$('#contasTable tbody').empty();
				// add table rows
				$.each(response.content, (i, contas) => {
					var ts = new Date(contas.emisao)
					var sts = new Date(contas.vencimento)
					var atual = contas.valor;
					var valor = atual.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
					let contasRow = '<tr>' +
						'<td >' + contas.id + '</td>' +
						'<td >' + ts.toLocaleDateString() + '</td>' +
						'<td >' + '0' + '</td>' +
						'<td id="td_nome">' + contas.descricao +
						'<td >' + valor + '</td>' +
						'<td >' + sts.toLocaleDateString() + '</td>' +
						'<td> <button onclick=baixa(' + contas.id + ') title="Editar">Baixar Registro</button>' +
						'<!--<button  onclick=ficha(' + contas.id + ') title="Baixa"><i class="bi bi-clipboard2-data-fill"></i></button> </td>-->' +
						'</tr>';
					$('#contasTable tbody').append(contasRow);
				});

				if ($('ul.pagination li').length - 1 != response.totalPages) {
					// build pagination list at the first time loading
					$('ul.pagination').empty();
					buildPagination(response);
				}
			}
		},
		error: function(e) {
		if (e.status == 403) {
			if (msg == ''){
				msg = "Seu TOKEN está expirado ou está logado em outra máquina, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO";
				fadeAviso.classList.toggle('hide')
				modalAviso.classList.toggle('hide')
				msgAviso(msg)
			}
			}else{
				const msg = "Error ao carregar contas a receber.... " + e.responseText;
				msgError(msg);
			}
		}
	});
}

function fetchNotes(startPage) {

	var url = '';
	var tipo = '';

	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked) {
			if (radios[i].value == 'mensalidade') {
				url = "contasbaixasrec/listamensalidades?sort=id"
				tipo = radios[i].value;
			} else {
				url = "contasbaixasrec/listacontas?sort=id"
				tipo = radios[i].value;
			}
		}
	}
	
	$.ajax({
		type: "GET",
		url: url,
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
			if (tipo == 'mensalidade') {
				tipoRadios = 'mensalidade';
				$('#contasTable tbody').empty();
				// add table rows
				$.each(response.content, (i, contas) => {
					var dataFormatada = contas[2].split('-').reverse().join('/');
					var dtFormatada = contas[6].split('-').reverse().join('/');
					var ts = new Date(contas[2])
					var sts = new Date(contas[6])
					var atual = contas[5];
					var valor = atual.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
					let contasRow = '<tr>' +
						'<td >' + contas[0] + '</td>' +
						'<td >' + dataFormatada + '</td>' +
						'<td >' + contas[4] + '</td>' +
						'<td id="td_nome">' + contas[9] +
						'<td >' + valor + '</td>' +
						'<td >' + dtFormatada + '</td>' +
						'<td> <button onclick=baixa(' + contas[0] + ') title="Baixa de Registro">Baixar Registro</button>' +
						'<!--<button  onclick=ficha(' + contas[0] + ') title="Baixa"><i class="bi bi-clipboard2-data-fill"></i></button> </td>-->' +
						'</tr>';
					$('#contasTable tbody').append(contasRow);
				});

				if ($('ul.pagination li').length - 1 != response.totalPages) {
					// build pagination list at the first time loading
					$('ul.pagination').empty();
					buildPagination(response);
				}
			}
			if (tipo == 'outros') {
				tipoRadios = 'outros';
				$('#contasTable tbody').empty();
				// add table rows
				$.each(response.content, (i, contas) => {
					var dataFormatada = contas.emisao.split('-').reverse().join('/');
					var dtFormatada = contas.vencimento.split('-').reverse().join('/');
					var atual = contas.valor;
					var valor = atual.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
					let contasRow = '<tr>' +
						'<td >' + contas.id + '</td>' +
						'<td >' + dataFormatada + '</td>' +
						'<td >' + '0' + '</td>' +
						'<td id="td_nome">' + contas.descricao +
						'<td >' + valor + '</td>' +
						'<td >' + dtFormatada + '</td>' +
						'<td> <button onclick=baixa('+ contas.id +') title="Baixa de Registro">Baixar Registro</button>' +
						'<button  onclick=edit(' + contas.id + ') title="Edit"><i class="bi bi-pencil-square"></i></button> </td>' +
						'</tr>';
					$('#contasTable tbody').append(contasRow);
				});

				if ($('ul.pagination li').length - 1 != response.totalPages) {
					// build pagination list at the first time loading
					$('ul.pagination').empty();
					buildPagination(response);
				}
			}
		},
		error: function(e) {
		if (xhr.status == 403) {
			if (msg == ''){
				msg = "Seu TOKEN está expirado ou está logado em outra máquina, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO";
				fadeAviso.classList.toggle('hide')
				modalAviso.classList.toggle('hide')
				msgAviso(msg)
			}
			}else{
				const msg = "Error ao carregar contas a receber.... " + xhr.responseText;
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
		if (tipo == 'contasrec') {
			fetchContasRec(0);
		} else {
			fetchNotes(0);
		}
		$("li.active").removeClass("active");
		// add .active to next-pagination li
		currentActive.next().addClass("active");
	} else if (val.toUpperCase() == "LAST »") {
		if (tipo == 'contasrec') {
			fetchContasRec(totalPages - 1);
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
			if (tipo == 'contasrec') {
				fetchContasRec(startPage);
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
			if (tipo == 'contasrec') {
				fetchContasRec(startPage);
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
		if (tipo == 'contasrec') {
			fetchContasRec(startPage);
		} else {
			fetchNotes(startPage);
		}
		// add focus to the li tag
		$("li.active").removeClass("active");
		$(this).parent().addClass("active");
		//$(this).addClass("active");
	}
});

function formatarMoedas(valor) {
	valor = valor + '';
	valor = parseInt(valor.replace(/[\D]+/g, ''));
	valor = valor + '';
	valor = valor.replace(/([0-9]{2})$/g, ".$1");

	if (valor.length > 6) {
		valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1.$2");
	}

	if (valor == 'NaN') elemento.value = '';
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

/*Modal Baixa*/

let modals = document.querySelector('#modals');
let fades = document.querySelector('#fades');

function baixa(idRec){
	regParcela = idRec;
	var status = '';
	
	if(tipoRadio != null){
		status = tipoRadio;
		tipoService = tipoRadio;
	}
	
	if(tipoRadios != null){
		status = tipoRadios;
		tipoService = tipoRadios;
	}
	
	modals.classList.toggle('hide')
	fades.classList.toggle('hide')
	pegaBaixa(status, idRec);
}

$(document).ready(function() {

	caixas();
	categoriaBaixaaReceber();

});

function caixas(){
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
			if (msg == ''){
				msg = "Seu TOKEN está expirado ou está logado em outra máquina, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO";
				fadeAviso.classList.toggle('hide')
				modalAviso.classList.toggle('hide')
				msgAviso(msg)
			}
			}else{
				const msg = "Error ao carregar caixas.... " + xhr.responseText;
				msgError(msg);
			}
	});
}

function categoriaBaixaaReceber(){
	
	let tipoEntrada = 'Entrada'
	let mess = '';
	let anos = '';
	
	$.ajax({
		method: "GET",
		url: "categorias/listacategoria?tipo="+tipoEntrada+"&mes="+mess+"&ano="+anos,
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
			if (msg == ''){
				msg = "Seu TOKEN está expirado ou está logado em outra máquina, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO";
				fadeAviso.classList.toggle('hide')
				modalAviso.classList.toggle('hide')
				msgAviso(msg)
			}
			}else{
				const msg = "Error ao carregar categorias.... " + xhr.responseText;
				msgError(msg);
			}
	});
}

function pegaBaixa(tipo, idRec){
	var myHeaders = new Headers();
	myHeaders.append("Authorization", localStorage.getItem("token"));
	myHeaders.append('Content-Type', 'application/json;charset=utf-8');
	
	/*const filtro = {
		tipo: tipo,
		idRec: idRec
	}*/
	
	$.ajax({
		method: "GET",
		url: "contasbaixasrec/pegaRegistro?idRec="+idRec+"&tipo="+tipo,
		timeout: 0,
		headers: {
			Authorization: localStorage.getItem("token")
		},
		success: function(response) {
			if(tipo == 'mensalidade'){
				var ts = new Date(response[0][7])
				var dataFormatada = ts.toLocaleDateString();
				var valor = response[0][6];
				valor = Intl.NumberFormat('en-IN',{ minimumFractionDigits: 2}).format(valor);
				$("#parcela").val(response[0][5]);
				$("#descricao").val(response[0][0]);
				$("#vencimento").val(dataFormatada);
				$("#valor").val(valor);
			}
			if (tipo == 'outros'){
				var dataFormatada = response[0].vencimento.split('-').reverse().join('/');
				var valor = response[0].valor;
				valor = Intl.NumberFormat('en-IN',{ minimumFractionDigits: 2}).format(valor);
				$("#parcela").val(0);
				$("#descricao").val(response[0].descricao);
				$("#vencimento").val(dataFormatada);
				$("#valor").val(valor);
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
			}else{
				const msg = "Error ao carregar contas a receber.... " + xhr.responseText;
				msgError(msg);
			}
	});
}

document.getElementById("close-modal").addEventListener("click", function(event){
	modals.classList.toggle('hide')
	fades.classList.toggle('hide')
});

const toggleModal = () => {
	[modals, fades].forEach((els) => {		
		els.classList.toggle("hide")
	});
}

document.querySelector('.save').addEventListener("click", function(event){
	event.preventDefault();
	var valor = $("#valor").val();
	var valorpago = $("#valorpago").val();
	
	if (valorpago < valor){
		salvarBaixa();
		var valor = valor - valorpago;
		valor = Intl.NumberFormat('en-IN',{ minimumFractionDigits: 2}).format(valor);
		$("#valor").val(valor);
		$("#valorpago").val('');
	}else{
		salvarBaixa();
		modals.classList.toggle('hide')
		fades.classList.toggle('hide')
		window.location.reload(true);
	}
	
})

function salvarBaixa(){
	var myHeaders = new Headers();
	myHeaders.append("Authorization", localStorage.getItem("token"));
	myHeaders.append('Content-Type', 'application/json;charset=utf-8');
	
	var dateNow = new Date();
	var dataFormatada = dateNow.toLocaleDateString();
	dataFormatada = dataFormatada.split('/').reverse().join('-');

	var id = $("#id").val();
	var parcela = $("#parcela").val();
	var categoria = $('#categoria').val();
	var dt_baixa = dataFormatada;
	var descricao = $("#descricao").val();
	var valor = $("#valorpago").val();
	var tipopgto = $("#tipopgto").val();
	var caixa = $('#caixa').val();
	var tipo = 'C';

	const baixa = {
		id: id,
		parcela: parcela,
		categoria: categoria,
		dt_baixa: dt_baixa,
		descricao: descricao,
		valor: valor,
		tipopgto: tipopgto,
		tipo: tipo,
		caixa:caixa
	};


	fetch('contasbaixasrec/salvarBaixa?regParcela='+regParcela+'&tipoService='+tipoService, {
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