let userLogado = JSON.parse(localStorage.getItem("userLogado")) 

let idFicha = JSON.parse(localStorage.getItem("idFicha")) 

let logado = document.querySelector('#logado')

let idAluno = "";
let idMat = "";

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
			
			response.matricula.sort(function (x, y) {
				return x.anoletivo - y.anoletivo;
			})
			
		//	console.log(response.matricula)
			
			$('#matriculaTable > tbody > tr').remove();
	          // add table rows
	          for (var i = 0; i < response.matricula.length; i++) {
				$('#matriculaTable > tbody').append(					
					'<tr>'+
					'<td>'+  response.matricula[i].anoletivo + '</td>'+
					'<td>'+  response.matricula[i].escolas + '</td>'+
					'<td>'+  response.matricula[i].turma + '</td>'+
					'<td>'+  response.matricula[i].turno + '</td>'+
					'<td><button class="btn" onclick=edit('+response.matricula[i].id+') title="Edita Matricula"><i class="fa-solid fa-pen-to-square"></i></button>'+
					'<button class="btn" onclick="openModalMensalidade()" title="Mensalidades"><i class="fa-solid fa-sack-dollar"></i></button></td>'+
					'</tr>');
			}
		//	localStorage.removeItem('idEdit')
		}
	}).fail(function(xhr, status, errorThrown) {
		alert("Erro ao buscar aluno por id : " + xhr.responseText);
	});

}

/*Modal Mensalidades*/

let modalMensalidade = document.querySelector('#modalMensalidade');
let fadeMensalidade = document.querySelector('#fadeMensalidade');

var clicked1 = false;

const toggleModalMens = () => {
	[modalMensalidade, fadeMensalidade].forEach((els) => {		
		els.classList.toggle("hide")
	});
}

const openModalMensalidade = () => {
	modalMensalidade.classList.toggle('hide')
	fadeMensalidade.classList.toggle('hide')
	autDados();
}

document.getElementById("closemodalMensalidade").addEventListener("click", function(event){
	modalMensalidade.classList.toggle('hide')
	fadeMensalidade.classList.toggle('hide')
//  	event.preventDefault()
});


function verificaStatusMens(){
	if (clicked1) {
	    clicked1 = false;
	  } else {
	    clicked1 = true;
	  }
}

function autDados(){
	document.querySelector('#labelMatriculaAluno').innerHTML = "Id Aluno:  " + idAluno;
}


/*Modal Matricula*/
let modal = document.querySelector('#modal');
let fade = document.querySelector('#fade');

document.getElementById("novoMatricula").addEventListener("click", function(event){
	modal.classList.toggle('hide')
	fade.classList.toggle('hide')
	autAno();
	autEscolas();
});

document.getElementById("close-modal").addEventListener("click", function(event){
	modal.classList.toggle('hide')
	fade.classList.toggle('hide')
	window.location.reload(true);
});

document.getElementById("salvaMatricula").addEventListener("click", function(event){
	salvaMatricula()
	event.preventDefault();
	setTimeout(() => {
		modal.classList.toggle('hide')
		fade.classList.toggle('hide')
		window.location.reload(true);
	},3000)
	
});

const edit = (id) => {
	modal.classList.toggle('hide')
	fade.classList.toggle('hide')
	autAno();
	autEscolas();
	pegaMatricula(id)
}


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
	
	var anoletivo = $("#selectAno ").val();
	var turma = $("#turma").val();
	var turno = $("#selectTurno").val();
	
	var select = document.getElementById('selectEscola');
	var escolas = select.options[select.selectedIndex].text;
	
	$.ajax({
		method : "POST",
		url : "matricula/salvar?idAluno="+idAluno,
		data : JSON.stringify({
			id: idMat,
			aluno: idAluno,
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
			const msg = "Realizando Matricula .... ";
			msgSuccess(msg);			
			
		}
	}).fail(function(xhr, status, errorThrown) {
		alert("Erro ao cadastrar matricula: " + xhr.responseText);
	});
}



function pegaMatricula (id){
	
	$.ajax({
		method : "GET",
		url : "matricula/buscarmatriculaid",
		data : "idmatricula=" + id,
		timeout: 0,
	    headers: {
	    Authorization: localStorage.getItem("token")
	 	 },
		success : function(response) {
			idMat = response.id;
			$("#selectAno").val(response.anoletivo);
			$("#selectEscola").val(response.escolas);
			$("#turma").val(response.turma);
			$("#selectTurno").val(response.turno);
		}
	}).fail(function(xhr, status, errorThrown) {
		alert("Erro ao buscar matricula por id : " + xhr.responseText);
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