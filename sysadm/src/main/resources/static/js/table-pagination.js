$(document).ready(function() {
	let totalPages = 1;
	
	function fetchNotes(startPage) {
		//console.log('startPage: ' +startPage);
		/**
		 * get data from Backend's REST API
		 */
	    $.ajax({
	        type : "GET",
	        url : "aluno/listatodos",
	        data: { 
	            page: startPage, 
	            size: 5
	        },
	        timeout: 0,
		    headers: {
		    Authorization: localStorage.getItem("token")
		 	 },
	        success: function(response){
	          $('#alunoTable tbody').empty();
	          // add table rows
	          $.each(response.content, (i, aluno) => {
	            let alunoRow = '<tr>' +
	      	  						'<td >' + aluno.id + '</td>' +
			                		'<td id="td_nome">' + aluno.nome + 
			                		'<p style="font-size: 12px; margin-top: 5px;" >' + aluno.email+'</p></td>' +
			                		'<td>' + aluno.dt_nasc + '</td>' +
			                		'<td>' + aluno.celular + '</td>' +
			                		'<td> <button title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>'+
			      						 '<button title="Excluir"><i class="fa-solid fa-trash"></i></button> </td>' +
			                   '</tr>';
	            $('#alunoTable tbody').append(alunoRow);
	          });

	          if ($('ul.pagination li').length - 2 != response.totalPages){
	          	  // build pagination list at the first time loading
	        	  $('ul.pagination').empty();
	              buildPagination(response);
	          }
	        },
	        error : function(e) {
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
