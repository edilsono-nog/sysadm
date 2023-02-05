const chartAtual = document.querySelectorAll(".chartAtual");
const chartAnteriores = document.querySelectorAll(".chartAnteriores");
let fadeAviso = document.querySelector('#fadeAviso');
let modalAviso = document.querySelector('#modalAviso');

var msg = '';

function aviso(){
	fadeAviso.classList.toggle('hide')
	modalAviso.classList.toggle('hide')
	msgAviso('teste de modal de Aviso') 
}

function sair(){
    localStorage.removeItem('token')
    localStorage.removeItem('userLogado')
    window.location.href = 'login'
    eraseCookie('JSESSIONID')
}

const divMessageAviso = document.querySelector(".avisos");

function msgAviso(msg) {
	const message = document.createElement("div");
	message.innerText = msg;
	divMessageAviso.appendChild(message);
}
