let userLogado = JSON.parse(localStorage.getItem("userLogado")) 

let idFichaResp = JSON.parse(localStorage.getItem("idFichaResp")) 
let idFicha = JSON.parse(localStorage.getItem("idFicha")) 

let logado = document.querySelector('#logado')

let idAluno = "";
let idMat = "";

if (userLogado != null) {
    logado.innerHTML = userLogado.name
}

if (idFichaResp != null) {
    autFicha(idFichaResp);
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
	localStorage.setItem('idFicha',JSON.stringify(idFicha))
	window.location.href='alunos_ficha'
	localStorage.removeItem('idFichaResp')
})

function autFicha(id) {

	$.ajax({
		method : "GET",
		url : "responsavel/buscaresponsavelid",
		data : "idResponsavel=" + id,
		timeout: 0,
	    headers: {
	    Authorization: localStorage.getItem("token")
	 	 },
		success : function(response) {

			if(response.dt_nasc != null || response.dt_nasc != ''){
				var dataFormatada = response.dt_nasc.split('-').reverse().join('/');
			}else {
				dataFormatada = '';
			}
			
			//console.log(response)
			
			document.querySelector('.id').innerHTML = response.id;
			idAluno = response.id;
			document.querySelector('.status').innerHTML = response.tipo;
			document.querySelector('.financeiro').innerHTML = response.financeiro;
			document.querySelector('.nome').innerHTML = response.nome;
			document.querySelector('.dtnascimento').innerHTML = dataFormatada;
			document.querySelector('.email').innerHTML = response.email;
			document.querySelector('.cpf').innerHTML = response.cpf;
			document.querySelector('.rg').innerHTML = response.rg;
			document.querySelector('.logradouro').innerHTML = response.logradouro;
			document.querySelector('.bairro').innerHTML = response.bairro;
			document.querySelector('.cidade').innerHTML = response.localidade;
			document.querySelector('.uf').innerHTML = response.uf;
			document.querySelector('.telefone').innerHTML = response.telefone;
			document.querySelector('.celular').innerHTML = response.celular;
			
			pegaAlunos(response.id);
		}
	}).fail(function(xhr, status, errorThrown) {
		alert("Erro ao buscar aluno por id : " + xhr.responseText);
	});

}

function pegaAlunos(id) {

	$.ajax({
		method : "GET",
		url : "responsavel/pegaalunos",
		data : "idResponsavel=" + id,
		timeout: 0,
	    headers: {
	    Authorization: localStorage.getItem("token")
	 	 },
		success : function(response) {
			response.sort(function (x, y) {
				return x.id - y.id;
			})
			
			$('#alunosTable > tbody > tr').remove();
	          // add table rows
	          for (var i = 0; i < response.length; i++) {
					$('#alunosTable > tbody').append(					
					'<tr>'+
					'<td>'+  response[i][10] + '</td>'+
					'<td><button class="btn" onclick=fichaAluno('+response[i][0]+') title="Dados do Aluno"><i class="fa-solid fa-clipboard"></i></button> </td>'+
					'</tr>');
				}			
		}
	}).fail(function(xhr, status, errorThrown) {
		alert("Erro ao buscar aluno por id : " + xhr.responseText);
	});

}

function fichaAluno(id){
	localStorage.setItem('idFichaAluno',JSON.stringify(id))
	window.location.href='alunos_ficha'
	localStorage.removeItem('idFichaResp')
}


function edit(){
	localStorage.setItem('idEditResp',JSON.stringify(idFichaResp))
	window.location.href='responsavel_cadastro'
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