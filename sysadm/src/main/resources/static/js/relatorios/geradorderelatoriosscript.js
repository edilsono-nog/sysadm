
let tipo;

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

document.querySelector('#selectRelatorio').addEventListener('change', ()=>{
	if(document.querySelector('#selectRelatorio').value == 'listatodos' || document.querySelector('#selectRelatorio').value == 'carteirinhas'){
		document.querySelector('#listaTipo').setAttribute('style', 'display: block; width: 30%;')
		document.querySelector('#selectTipo').setAttribute('style', 'width: 90%;');
	    document.querySelector('#labeltipo').setAttribute('style', 'width: 35%;');
	}else if(document.querySelector('#selectRelatorio').value == 'Selecione...'){
	    document.querySelector('#listaTipo').setAttribute('style', 'display: none;')
	    document.querySelector('#listaTurno').setAttribute('style', 'display: none;');
	    document.querySelector('#selectTipo').setAttribute('style', 'width: 20%;');
	    document.querySelector('#labeltipo').setAttribute('style', 'width: 10%;');
	}
	/*if(document.querySelector('#selectRelatorio').value == 'carteirinhas'){
		document.querySelector('#listaTipoCarteirinha').setAttribute('style', 'display: block; width: 30%;')
		document.querySelector('#selectTipoCarteirinha').setAttribute('style', 'width: 90%;');
	    document.querySelector('#labeltipoCarteirinha').setAttribute('style', 'width: 35%;');
	}else if(document.querySelector('#selectRelatorio').value == 'Selecione...'|| document.querySelector('#selectRelatorio').value == 'listatodos'){
		document.querySelector('#listaTipoCarteirinha').setAttribute('style', 'display: none;')
		document.querySelector('#selectTipoCarteirinha').setAttribute('style', 'width: 20%;');
	    document.querySelector('#labeltipoCarteirinha').setAttribute('style', 'width: 10%;');
	}*/
})

document.querySelector('#selectTipo').addEventListener('change', ()=>{
	if(document.querySelector('#selectTipo').value == 'Selecione...'){
		document.querySelector('#listaTurno').setAttribute('style', 'display: none;');
		document.querySelector('#listaEscolas').setAttribute('style', 'display: none;');
	}else if(document.querySelector('#selectTipo').value == 'Todos'){
		document.querySelector('#listaTurno').setAttribute('style', 'display: none;');
		document.querySelector('#listaEscolas').setAttribute('style', 'display: none;');
	}else if(document.querySelector('#selectTipo').value == 'Turno'){
		document.querySelector('#listaEscolas').setAttribute('style', 'display: none;');
		document.querySelector('#listaTurno').setAttribute('style', 'display: block;');
		document.querySelector('#selectTurno').setAttribute('style', 'width: 30%;');
	    document.querySelector('#labelturno').setAttribute('style', 'width: 15%;');
	}else if(document.querySelector('#selectTipo').value == 'Escolas'){
		document.querySelector('#listaEscolas').setAttribute('style', 'display: block;');
		document.querySelector('#listaTurno').setAttribute('style', 'display: none;');
	}
})

document.querySelector('.imprimir').addEventListener('click', ()=>{
	var select = document.getElementById('selectEscola');
	let escolas = select.options[select.selectedIndex].text;
	
	if(document.querySelector('#selectTipo').value == 'Todos'){
		tipo = document.querySelector('#selectTipo').value;
	}else if(document.querySelector('#selectTipo').value == 'Turno'){
		tipo = document.querySelector('#selectTurno').value;
	}else if(document.querySelector('#selectTipo').value == 'Escolas'){
		tipo = escolas;
	}
	
	if (document.querySelector('#selectRelatorio').value == 'listatodos'){
		window.open('geradorderelatorios/listadealunos?name='+tipo, '_blank');
	}else if (document.querySelector('#selectRelatorio').value == 'carteirinhas'){
		window.open('geradorderelatorios/geracarteirinhas?name='+tipo, '_blank');
	}
})

document.querySelector('.vizualizar').addEventListener('click', ()=>{
	
	var select = document.getElementById('selectEscola');
	let escolas = select.options[select.selectedIndex].text;
	
	if(document.querySelector('#selectTipo').value == 'Todos'){
		tipo = document.querySelector('#selectTipo').value;
	}else if(document.querySelector('#selectTipo').value == 'Turno'){
		tipo = document.querySelector('#selectTurno').value;
	}else if(document.querySelector('#selectTipo').value == 'Escolas'){
		tipo = escolas;
	}
	
	if (document.querySelector('#selectRelatorio').value == 'listatodos'){
		listadealunos(tipo);
	}else if (document.querySelector('#selectRelatorio').value == 'carteirinhas'){
		geracarteirinhas(tipo);
	}
})

function listadealunos(tipo){
		$.ajax({
		method : "GET",
		url : "visualizador/listadealunos",
		data : "name=" + tipo,
		timeout: 0,
	    headers: {
	    Authorization: localStorage.getItem("token")
	 	 },
		success : function(response) {
			$('#multiTable > thead > tr').remove();
			$('#multiTable > thead').append(
				'<tr>'+
					'<th scope="col" >Nome do Aluno </th>'+
					'<th scope="col" >Turno</th>'+
					'<th scope="col" >Responsável</th>'+
					'<th scope="col" >Telefone Resp.</th>'+
					'<th scope="col" >Escola</th>'+
				'</tr');
			$('#multiTable > tbody > tr').remove();
	          // add table rows
	          for (var i = 0; i < response.length; i++) {
				$('#multiTable > tbody').append(					
					'<tr>'+
						'<td style="text-align: left;">'+  response[i].aluno + '</td>'+
						'<td >'+  response[i].turno + '</td>'+
						'<td style="text-align: left;">'+  response[i].responsavel + '</td>'+
						'<td >'+  response[i].telresp + '</td>'+
						'<td style="text-align: left;">'+  response[i].escolas + '</td>'+
					'</tr>')};
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
				const msg = "Error ao carregar lista de alunos.... " + xhr.responseText;
				msgError(msg);
			}
	});
}

function geracarteirinhas(tipo){
		$.ajax({
		method : "GET",
		url : "visualizador/geracarteirinhas",
		data : "name=" + tipo,
		timeout: 0,
	    headers: {
	    Authorization: localStorage.getItem("token")
	 	 },
		success : function(response) {
			$('#multiTable > thead > tr').remove();
			$('#multiTable > thead').append(
				'<tr>'+
					'<th scope="col" >Nome do Aluno </th>'+
					'<th scope="col" >Turma</th>'+
					'<th scope="col" >Turno</th>'+
					'<th scope="col" >Escola</th>'+
					'<th scope="col" >Dia de Vencimento</th>'+
					'<th scope="col" >Valor Mensalidade</th>'+
				'</tr');
			$('#multiTable > tbody > tr').remove();
	          // add table rows
	          for (var i = 0; i < response.length; i++) {
				  var atual = response[i].valor;
				  var valor = atual.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
				$('#multiTable > tbody').append(					
					'<tr>'+
						'<td style="text-align: left;">'+  response[i].aluno + '</td>'+
						'<td >'+  response[i].turma + '</td>'+
						'<td >'+  response[i].turno + '</td>'+
						'<td >'+  response[i].escolas + '</td>'+
						'<td >'+  response[i].venc + '</td>'+
						'<td >'+  valor + '</td>'+
					'</tr>')};
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
				const msg = "Error ao carregar lista de alunos.... " + xhr.responseText;
				msgError(msg);
			}
	});
}

$(document).ready(function() {
	autEscolas();
})

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
		if (xhr.status == 403) {
			if (msg == ''){
				msg = "Seu TOKEN está expirado ou está logado em outra máquina, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO";
				fadeAviso.classList.toggle('hide')
				modalAviso.classList.toggle('hide')
				msgAviso(msg)
			}
			}else{
				const msg = "Error ao carregar lista de escolas.... " + xhr.responseText;
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