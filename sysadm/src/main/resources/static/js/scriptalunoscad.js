let userLogado = JSON.parse(localStorage.getItem("userLogado")) 

let logado = document.querySelector('#logado')

if (userLogado != null) {
    logado.innerHTML = userLogado.name
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

const cep = document.querySelector('#cep')

cep.addEventListener('keypress', ()=>{
	let ceplength = cep.value.length
	
	if(ceplength == 5){
		cep.value += '-'
	}
})

const telefone = document.querySelector('#telefone')

telefone.addEventListener('keypress', ()=>{
	let telefonelength = telefone.value.length
	
	if(telefonelength == 0){
		telefone.value += '('
	}else if(telefonelength == 3){
		telefone.value += ')'
	}else if(telefonelength == 8){
		telefone.value += '-'
	}
})

const celular = document.querySelector('#celular')

celular.addEventListener('keypress', ()=>{
	let celularlength = celular.value.length
	
	if(celularlength == 0){
		celular.value += '('
	}else if(celularlength == 3){
		celular.value += ')'
	}else if(celularlength == 9){
		celular.value += '-'
	}
})

const cpf = document.querySelector('#cpf')

cpf.addEventListener('keypress', ()=>{
	let cpflength = cpf.value.length
	
	if(cpflength == 3 || cpflength == 7){
		cpf.value += '.'
	}else if(cpflength == 11){
		cpf.value += '-'
	}
})

let cpfs = document.getElementById('cpf')
let labelCpf = document.querySelector('#labelCpf')

cpfs.onblur = function(){
	if(!validarCPF(cpfs.value)){
		labelCpf.setAttribute('style', 'color: red;')
		labelCpf.innerHTML = 'CPF:  *Inválido'
		cpfs.setAttribute('style', 'border-color: red;')
		cpfs.focus();
	}else{
		labelCpf.setAttribute('style', 'color: black;')
		labelCpf.innerHTML = 'CPF:'
		cpfs.setAttribute('style', 'border-color: black;')
	}
}

function validarCPF(cpf) {	
	cpf = cpf.replace(/[^\d]+/g,'');	
	if(cpf == '') return false;	
	// Elimina CPFs invalidos conhecidos	
	if (cpf.length != 11 || 
		cpf == "00000000000" || 
		cpf == "11111111111" || 
		cpf == "22222222222" || 
		cpf == "33333333333" || 
		cpf == "44444444444" || 
		cpf == "55555555555" || 
		cpf == "66666666666" || 
		cpf == "77777777777" || 
		cpf == "88888888888" || 
		cpf == "99999999999")
			return false;		
	// Valida 1o digito	
	add = 0;	
	for (i=0; i < 9; i ++)		
		add += parseInt(cpf.charAt(i)) * (10 - i);	
		rev = 11 - (add % 11);	
		if (rev == 10 || rev == 11)		
			rev = 0;	
		if (rev != parseInt(cpf.charAt(9)))		
			return false;		
	// Valida 2o digito	
	add = 0;	
	for (i = 0; i < 10; i ++)		
		add += parseInt(cpf.charAt(i)) * (11 - i);	
	rev = 11 - (add % 11);	
	if (rev == 10 || rev == 11)	
		rev = 0;	
	if (rev != parseInt(cpf.charAt(10)))
		return false;		
	return true;   
}

let cancel = document.querySelector('.cancel')

cancel.addEventListener('click', ()=>{
	window.location.href='listacad'
})

function salvarAluno(){
	var id = $("#id").val();
	var nome = $("#nome").val();
	var dtnascimento = $("#dtnascimento").val();
	var email = $("#email").val();
	var cep = $("#cep").val();
	var logradouro = $("#logradouro").val();
	var complemento = $("#complemento").val();
	var bairro = $("#bairro").val();
	var cidade = $("#cidade").val();
	var uf = $("#uf").val();
	var telefone = $("#telefone").val();
	var celular = $("#celular").val();
	var cpf = $("#cpf").val();
	var rg = $("#rg").val();
	
	if (nome == null || nome != null && nome.trim() == ''){
		$("#nome").focus();
		alert('Informe o nome');
		return;
	}
		
	$.ajax({
		method: "POST",
		url : "aluno/salvar",
		data : JSON.stringify({
			id: id,
			nome: nome,
			dt_nasc: dtnascimento,
			email: email,
			cep: cep,
			logradouro: logradouro,
			complemento: complemento,
			bairro: bairro,
			localidade: cidade,
			uf: uf,
			telefone: telefone,
			celular: celular,
			cpf: cpf,
			rg: rg
		}),
		contentType: "application/json; charset=utf-8",
		timeout: 0,
	    headers: {
	    Authorization: localStorage.getItem("token")
	 	 },
		success: function (response) {
			$("#id").val(response.id);
			const msg = "Realizando cadatro.... ";
			msgSuccess(msg);
			document.getElementById('formCadastroAluno').reset();
			setTimeout(() => {
				window.location.href='listacad'
			},3000)
		}
	}).fail(function (xhr, status, errorThrown) {
		const msg = "Error ao cadatrar.... " + xhr.responseText;
		msgError(msg);
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
