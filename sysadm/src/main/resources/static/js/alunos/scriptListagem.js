let userLogados = JSON.parse(localStorage.getItem("userLogado")) 

let logado = document.querySelector('#logado')

let status = document.querySelector('#status')
let $select = document.querySelector('#status');
let localiza = document.querySelector('#localiza')

if (userLogados != null) {
    logado.innerHTML = userLogados.name
}

let paginas = 5;

let totalPages = 1;

fetchAlunos(0);

let tipo = '';

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

function cadastrar(){
	window.location.href='alunos_cadastro'
}

function edit(id){
	localStorage.setItem('idEdit',JSON.stringify(id))
	window.location.href='alunos_cadastro'
}

localiza.addEventListener('keyup', ()=>{
	fetchAlunos(0)
})

document.querySelector('#selectQtde').addEventListener('change', ()=>{
	paginas = $('#selectQtde').val();
	fetchAlunos(0)
})

function fetchAlunos(startPage) {
		
	    $.ajax({
	        type : "GET",
	        url : "aluno/listaCadastros?sort=id",
	        data: { 
				page: startPage, 
				size: paginas, 
				status: $select.value,  
				name: localiza.value
			},
	        timeout: 0,
		    headers: {
		    Authorization: localStorage.getItem("token")
		 	 },
	        success: function(response){
	          $('#alunoTable tbody').empty();
	          // add table rows
	          $.each(response.content, (i, aluno) => {
				  var dataNasc;
				  if(aluno[2] != null){
					  dataNasc = aluno[2].split('-').reverse().join('/');
				  }else{
					  dataNasc = '';
				  }
				 let alunoRow = '<tr>' +
	      	  						'<td >' + aluno[0] + '</td>' +
			                		'<td style="text-align: left;" >' + aluno[1] + 
			                		'<p style="font-size: 10px; margin-top: 5px;" >' + aluno[3]+'</p></td>' +
			                		'<td>' + dataNasc + '</td>' +
			                		'<td>' + aluno[4] + '</td>' +
			                		'<td>' + aluno[5] + '</td>' +
			                		'<td> <button  onclick=edit('+aluno[0]+') title="Editar"><i class="bi bi-pencil-square"></i></button>'+
			      						 '<button  onclick=ficha('+aluno[0]+') title="Ficha"><i class="bi bi-clipboard2-data-fill"></i></button> </td>' +
			                   '</tr>';
	            $('#alunoTable tbody').append(alunoRow);
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
					alert("Erro ao buscar Alunos : " + xhr.responseText);
				}
	        }
	    });
	}

document.querySelector('#status').addEventListener('change', ()=>{
	if($select.value == "Todos"){
	       	fetchAlunos(0);
	}else if($select.value == 'Ativo'){
	    	fetchAlunos(0);
	}else if($select.value == 'Inativo'){
	    	fetchAlunos(0);
	}
})
	
function buildPagination(response) {
		totalPages = response.totalPages;

		var pageNumber = response.pageable.pageNumber;
		
		var numLinks = paginas;
		
		// print 'previous' link only if not on page one
		var first = '';
		var prev = '';
		if (pageNumber > 0) {
			if(pageNumber != 0) {
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
			if(pageNumber != totalPages - 1) {
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
		if(val.toUpperCase() == "« FIRST") {
			let currentActive = $("li.active");
			fetchAlunos(0);
			$("li.active").removeClass("active");
	  		// add .active to next-pagination li
	  		currentActive.next().addClass("active");
		} else if(val.toUpperCase() == "LAST »") {
			fetchAlunos(totalPages - 1);
			$("li.active").removeClass("active");
	  		// add .active to next-pagination li
	  		currentActive.next().addClass("active");
		} else if(val.toUpperCase() == "NEXT ›") {
	  		let activeValue = parseInt($("ul.pagination li.active").text());
	  		if(activeValue < totalPages){
	  			let currentActive = $("li.active");
				startPage = activeValue;
				fetchAlunos(startPage);
	  			// remove .active class for the old li tag
	  			$("li.active").removeClass("active");
	  			// add .active to next-pagination li
	  			currentActive.next().addClass("active");
	  		}
	  	} else if(val.toUpperCase() == "‹ PREV") {
	  		let activeValue = parseInt($("ul.pagination li.active").text());
	  		if(activeValue > 1) {
	  			// get the previous page
				startPage = activeValue - 2;
				fetchAlunos(startPage);
	  			let currentActive = $("li.active");
	  			currentActive.removeClass("active");
	  			// add .active to previous-pagination li
	  			currentActive.prev().addClass("active");
	  		}
	  	} else {
			startPage = parseInt(val - 1);
			fetchAlunos(startPage);
	  		// add focus to the li tag
	  		$("li.active").removeClass("active");
	  		$(this).parent().addClass("active");
			//$(this).addClass("active");
	  	}
    });

function ficha(id){
	localStorage.setItem('idFicha',JSON.stringify(id))
	window.location.href='alunos_ficha'
}