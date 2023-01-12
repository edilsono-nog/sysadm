$(document).ready(function() {
	
		
	let totalPages = 1;
	
	function fetchNotes(startPage) {
		
		//console.log('startPage: ' +startPage);
		/**
		 * get data from Backend's REST API
		 */
	    $.ajax({
	        type : "GET",
	        url : "responsavel?sort=id&",
	        data: { 
				page: startPage, 
				size: 5 
			},
	        timeout: 0,
		    headers: {
		    Authorization: localStorage.getItem("token")
		 	 },
	        success: function(response){
			
			if(response == null && response == ''){
				document.getElementById("add_new").disabled = false;
			} 
	          $('#responsaveisTable tbody').empty();
	          // add table rows
	          $.each(response.content, (i, responsavel) => {
				 let responsavelRow = '<tr>' +
	      	  						'<td >' + responsavel.id + '</td>' +
			                		'<td id="td_nome">' + responsavel.nome + 
			                		'<p style="font-size: 11px; margin-top: 5px;" >' + responsavel.email+'</p></td>' +
			                		'<td>' + responsavel.dt_nasc + '</td>' +
			                		'<td>' + responsavel.celular + '</td>' +
			                		'<td> <button id="btn" onclick=associar('+responsavel.id+') title="Associar"><i class="bi bi-box-arrow-in-right"></i></button></td>' +
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
	          if (e.status == 403){
				const msg = "Seu TOKEN está expirado, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO";
				msgError(msg);
				setTimeout(() => {
					sair();
				},5000)
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
			fetchNotes(0);
			$("li.active").removeClass("active");
	  		// add .active to next-pagination li
	  		currentActive.next().addClass("active");
		} else if(val.toUpperCase() === "LAST »") {
			fetchNotes(totalPages - 1);
			$("li.active").removeClass("active");
	  		// add .active to next-pagination li
	  		currentActive.next().addClass("active");
		} else if(val.toUpperCase() === "NEXT ›") {
	  		let activeValue = parseInt($("ul.pagination li.active").text());
	  		if(activeValue < totalPages){
	  			let currentActive = $("li.active");
				startPage = activeValue;
				fetchNotes(startPage);
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
				fetchNotes(startPage);
	  			let currentActive = $("li.active");
	  			currentActive.removeClass("active");
	  			// add .active to previous-pagination li
	  			currentActive.prev().addClass("active");
	  		}
	  	} else {
			startPage = parseInt(val - 1);
			fetchNotes(startPage);
	  		// add focus to the li tag
	  		$("li.active").removeClass("active");
	  		$(this).parent().addClass("active");
			//$(this).addClass("active");
	  	}
    });
	(function(){
	    	// get first-page at initial time
	    	fetchNotes(0);
	    })();

	
});
	
function sair(){
    localStorage.removeItem('token')
    localStorage.removeItem('userLogado')
    window.location.href = 'login'
    eraseCookie('JSESSIONID')
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