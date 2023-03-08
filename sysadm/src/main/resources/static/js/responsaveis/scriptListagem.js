let userLogados = JSON.parse(localStorage.getItem("userLogado")) 
let idAluno = JSON.parse(localStorage.getItem("idFicha")) 
let logado = document.querySelector('#logado')
let adicionar = document.querySelector('.add_new')
adicionar.disabled = true;
let localiza = document.querySelector('#localiza')

let tipo = '';

if (userLogados != null) {
    logado.innerHTML = userLogados.name
}

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

listResponsaveis(0);

localiza.addEventListener('keyup', ()=>{
	listResponsaveis(0);
})

document.querySelector('#voltar').addEventListener('click', ()=>{
	window.location.href='alunos_ficha'
})

let totalPages = 1;

function listResponsaveis(startPage) {
    $.ajax({
        type : "GET",
        url : "responsavel/listaResponsaveis?sort=id",
        data: { 
			page: startPage, 
			size: 5,   
			name: localiza.value
		},
        timeout: 0,
	    headers: {
	    Authorization: localStorage.getItem("token")
	 	 },
        success: function(response){
		 if (response.content.length == 0 ){
				adicionar.disabled = false;
			}else {
				adicionar.disabled = true;
			}
          $('#responsaveisTable tbody').empty();
	          // add table rows
	          $.each(response.content, (i, responsavel) => {
				  var dataNasc;
				  if(responsavel[3] != null){
					  dataNasc = responsavel[3].split('-').reverse().join('/');
				  }else{
					  dataNasc = '';
				  }
				 let responsavelRow = '<tr>' +
	      	  						'<td >' + responsavel[0] + '</td>' +
			                		'<td style="text-align: left;">' + responsavel[1] + 
			                		'<p style="font-size: 11px; margin-top: 5px;" >' + responsavel[2]+'</p></td>' +
			                		'<td>' + dataNasc + '</td>' +
			                		'<td>' + responsavel[4] + '</td>' +
			                		'<td> <button class="btn-primary btns" style="margin-left: 42%;" onclick=associar('+responsavel[0]+') title="Associar"><i class="bi bi-box-arrow-in-right"></i></button></td>' +
			                   '</tr>';
	            $('#responsaveisTable tbody').append(responsavelRow);
          });

          if ($('ul.pagination li').length - 1 != response.totalPages){
          	  // build pagination list at the first time loading
        	  $('ul.pagination').empty();
              buildPagination(response);
          }
        },
        error : function(e) {
			if (e.status == 403) {
			if (msg == ''){
				msg = "Seu TOKEN está expirado ou está logado em outra máquina, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO";
				fadeAviso.classList.toggle('hide')
				modalAviso.classList.toggle('hide')
				msgAviso(msg)
			}
			}else{
				const msg = "Error ao pesquisar responsável.... " + e.responseText;
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
			if(pageNumber !== 0) {
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
			if(pageNumber !== totalPages - 1) {
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
		if(val.toUpperCase() === "« FIRST") {
			let currentActive = $("li.active");
			listResponsaveis(0);
			$("li.active").removeClass("active");
	  		// add .active to next-pagination li
	  		currentActive.next().addClass("active");
		} else if(val.toUpperCase() === "LAST »") {
			listResponsaveis(totalPages - 1);
			$("li.active").removeClass("active");
	  		// add .active to next-pagination li
	  		currentActive.next().addClass("active");
		} else if(val.toUpperCase() === "NEXT ›") {
	  		let activeValue = parseInt($("ul.pagination li.active").text());
	  		if(activeValue < totalPages){
	  			let currentActive = $("li.active");
				startPage = activeValue;
				listResponsaveis(startPage);
	  			// remove .active class for the old li tag
	  			$("li.active").removeClass("active");
	  			// add .active to next-pagination li
	  			currentActive.next().addClass("active");
	  		}
	  	} else if(val.toUpperCase() === "‹ PREV") {
	  		let activeValue = parseInt($("ul.pagination li.active").text());
	  		if(activeValue > 1) {
	  			// get the previous page
				startPage = activeValue - 2;
				listResponsaveis(startPage);
	  			let currentActive = $("li.active");
	  			currentActive.removeClass("active");
	  			// add .active to previous-pagination li
	  			currentActive.prev().addClass("active");
	  		}
	  	} else {
			startPage = parseInt(val - 1);
			listResponsaveis(startPage);
	  		// add focus to the li tag
	  		$("li.active").removeClass("active");
	  		$(this).parent().addClass("active");
			//$(this).addClass("active");
	  	}
    });


function cadastrar(){
	window.location.href='responsavel_cadastro'
}

function associar(id){
	
	$.ajax({
		method: "POST",
		url : "responsavel/associar?idAluno="+idAluno+"&idResponsavel="+id,
		contentType: "application/json; charset=utf-8",
		timeout: 0,
	    headers: {
	    Authorization: localStorage.getItem("token")
	 	 },
		success: function (response) {
			
			msgSuccess(response);			
			setTimeout(() => {
					window.location.href='alunos_ficha'
			},3000)
		}
		
	}).fail(function (xhr, status, errorThrown) {
	
		if (xhr.status == 403) {
			if (msg == ''){
				msg = "Seu TOKEN está expirado ou está logado em outra máquina, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO";
				fadeAviso.classList.toggle('hide')
				modalAviso.classList.toggle('hide')
				msgAviso(msg)
			}
		}
		
		if (xhr.status == 400){
			const msg = xhr.responseText;
			msgError(msg);
		}		
		
	});
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

function sair(){
    localStorage.removeItem('token')
    localStorage.removeItem('userLogado')
    window.location.href = 'login'
    eraseCookie('JSESSIONID')
}