let userLogado = JSON.parse(localStorage.getItem("userLogado")) 

let idFicha = JSON.parse(localStorage.getItem("idFicha")) 

let logado = document.querySelector('#logado')

var idAluno = ""

if (userLogado != null) {
    logado.innerHTML = userLogado.name
}

if (idFicha != null) {
    autFicha(idFicha);
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

document.querySelector('#voltar').addEventListener('click', ()=>{
	localStorage.removeItem('idFicha')
	window.location.href='listacad'
})

function autFicha(id) {

	$.ajax({
		method : "GET",
		url : "aluno/buscaralunoid",
		data : "iduser=" + id,
		timeout: 0,
	    headers: {
	    Authorization: localStorage.getItem("token")
	 	 },
		success : function(response) {
			var dataFormatada = response.dt_nasc.split('-').reverse().join('/');
			
		//	console.log(response.matricula)
			
			document.querySelector('.id').innerHTML = response.id;
			idAluno = response.id;
			document.querySelector('.status').innerHTML = response.status;
			document.querySelector('.nome').innerHTML = response.nome;
			document.querySelector('.dtnascimento').innerHTML = dataFormatada;
			document.querySelector('.email').innerHTML = response.email;
			document.querySelector('.logradouro').innerHTML = response.logradouro;
			document.querySelector('.bairro').innerHTML = response.bairro;
			document.querySelector('.cidade').innerHTML = response.localidade;
			document.querySelector('.uf').innerHTML = response.uf;
			document.querySelector('.telefone').innerHTML = response.telefone;
			document.querySelector('.celular').innerHTML = response.celular;
			
			$('#matriculaTable > tbody > tr').remove();
	          // add table rows
	          for (var i = 0; i < response.matricula.length; i++) {
				$('#matriculaTable > tbody').append(
					'<tr>'+
					'<td>'+  response.matricula[i].anoLetivo.ano + '</td>'+
					'<td>'+  response.matricula[i].escolas.escola + '</td>'+
					'<td>'+  response.matricula[i].turma + '</td>'+
					'<td>'+  response.matricula[i].turno + '</td>'+
					'<td><button class="btn" onclick=edit('+response.matricula[i].id+') title="Editar"><i class="fa-solid fa-pen-to-square"></i></button></td>'+
					'</tr>');
			}
		//	localStorage.removeItem('idEdit')
		}
	}).fail(function(xhr, status, errorThrown) {
		alert("Erro ao buscar aluno por id : " + xhr.responseText);
	});

}

function edit(id) {
	//edit
}

/*Modal */

let openModalMatricula = document.querySelector("#novoMatricula");
let closeModalButton = document.querySelector("#close-modal");
let modal = document.querySelector('#modal');
let fade = document.querySelector('#fade');

var clicked = false;

const toggleModal = () => {
	[modal, fade].forEach((el) => {		
		el.classList.toggle("hide")
	});
}

[openModalMatricula, closeModalButton].forEach((el) => {
	el.addEventListener("click", () => {
		toggleModal()
		if (clicked) {
		    console.log('tchau');
		    salvaMatricula();
		    clicked = false;
		    document.location.reload(true);
		  } else {
			$("#idAluno").val(idAluno);
			$("#idMatricula").val(idAluno);
			autAno();
			autEscolas();
		    clicked = true;
		  }
	})	
});


function autAno() {

	$.ajax({
		method : "GET",
		url : "anoletivo/listaAno",
		timeout: 0,
	    headers: {
	    Authorization: localStorage.getItem("token")
	 	 },
		success : function(response) {
			 for (var i = 0; i < response.length; i++) {
				$('#selectAno').append(
					'<option value='+response[i].ano+'>'+response[i].ano+'</option>'
					);
			}
		}
	}).fail(function(xhr, status, errorThrown) {
		alert("Erro ao atualizar lita anoletivo: " + xhr.responseText);
	});

}

function autEscolas() {

	$.ajax({
		method : "GET",
		url : "escolas/listaEscola",
		timeout: 0,
	    headers: {
	    Authorization: localStorage.getItem("token")
	 	 },
		success : function(response) {
			 for (var i = 0; i < response.length; i++) {
				$('#selectEscola').append(
					'<option value='+response[i].escola+'>'+response[i].escola+'</option>'
					);
			}
		}
	}).fail(function(xhr, status, errorThrown) {
		alert("Erro ao atualizar lita anoletivo: " + xhr.responseText);
	});

}



function salvaMatricula() {
	
	var idMatricula =$("#idMatricula");
	var aluno = $("#idAluno").val();
	var anoletivo = $("#selectAno").val();
	var escolas = $("#selectEscola").val();
	var turma = $("#turma").val();
	var turno = $("#selectTurno").val();
	
	$.ajax({
		method : "POST",
		url : "matricula/salvar",
		data :JSON.stringify({
			id: idMatricula,
			aluno: aluno,
			anoletivo: anoletivo,
			escolas: escolas,
			turma: turma,
			turno: turno
		}), 
		contentType: "application/json; charset=utf-8",
		timeout: 0,
	    headers: {
	    Authorization: localStorage.getItem("token")
	 	 },
		success : function(response) {
			 console.log(response)
		}
	}).fail(function(xhr, status, errorThrown) {
		alert("Erro ao atualizar lita anoletivo: " + xhr.responseText);
	});
}

let salMat = document.querySelector('#salvaMatricula').addEventListener('click', ()=>{
	console.log('salvando')
	salvaMatricula();
})
