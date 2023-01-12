let modal = document.querySelector('#modal');
let fade = document.querySelector('#fade');
let formalt = document.querySelector("#form-alttela");
let newpassword = document.querySelector('#newPassword')
let btn1 = document.querySelector('.fa1');
let btn = document.querySelector('.fa-eye');
let userLogado = JSON.parse(localStorage.getItem("userLogado"))
let btnalt = document.querySelector('.btn');
const divMessages = document.querySelector(".alert");

btnalt.disabled = true;

var user = userLogado.user;

document.getElementById("altSenha").addEventListener("click", function(event) {
	modal.classList.toggle('hide')
	fade.classList.toggle('hide')
});

document.getElementById("close-modal").addEventListener("click", function(event) {
	modal.classList.toggle('hide')
	fade.classList.toggle('hide')
	window.location.reload(true);
});

document.querySelector('#confPassword').addEventListener('keyup', () => {
	let confpassword = document.querySelector('#confPassword')
	if (newpassword.value != confpassword.value) {
		confpassword.setAttribute('style', 'color: red;');
		btnalt.disabled = true;
	} else {
		confpassword.setAttribute('style', 'color: #333;');
		btnalt.disabled = false;
	}
})

btn.addEventListener('click', () => {
	let inputSenha = document.querySelector('#newPassword')

	if (inputSenha.getAttribute('type') == 'password') {
		inputSenha.setAttribute('type', 'text')
	} else {
		inputSenha.setAttribute('type', 'password')
	}
})

btn1.addEventListener('click', () => {
	let inputSenha = document.querySelector('#confPassword')

	if (inputSenha.getAttribute('type') == 'password') {
		inputSenha.setAttribute('type', 'text')
	} else {
		inputSenha.setAttribute('type', 'password')
	}
})

document.getElementById("alterar").addEventListener("click", function(event) {
	var myHeaders = new Headers();
	myHeaders.append("Authorization", localStorage.getItem("token"));

	let password = document.querySelector("#confPassword");

	password = password.value;

	fetch('usuario/autsenhatela?user=' + user + "&password=" + password, {
		method: 'PUT',
		headers: myHeaders
	})
		.then(response => {
			if (response.status == 200) {
				return response.text();
			}
			if (response.status == 400) {
				throw Error(response.statusText);
			}
		})
		.then(result => {
			alert(result + "\n" + "Tem que fazer novo Login.");
			modal.classList.toggle('hide')
			fade.classList.toggle('hide')
			window.location.href = 'login'
		})
		.catch(error => {
			console.log(error);
		});
});

formalt.addEventListener("submit", function(event) {
	event.preventDefault();
	
})

function msgSuccess(msg) {
	const message = document.createElement("div");
	message.classList.add("messageSucesso");
	message.innerText = msg;
	divMessages.appendChild(message);

	setTimeout(() => {
		message.style.display = "none";
	}, 3000);
}