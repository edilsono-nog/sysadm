let btn1 = document.querySelector('.fa1');
let btn = document.querySelector('.fa-eye');
const divMessage = document.querySelector(".alert");

let form = document.querySelector("#form");
let formverif = document.querySelector("#form-verif");
let formalt = document.querySelector("#form-alt");


let conf = document.querySelector("#conf");
let verif = document.querySelector("#verif");
let alt = document.querySelector("#alt");
let btnalt = document.querySelector('.btn-alt');

btnalt.disabled = true;

let user = "";
let codigo = "";


document.addEventListener('keypress', function(e) {
	if (e.key === 'Enter') {
		const btns = document.querySelector('.btn');
		btns.click();
	}
})

document.querySelector(".btn-can").addEventListener('click', () => {
	window.location.href = 'login'
})

form.addEventListener("submit", function(event) {
	event.preventDefault();

	let username = document.querySelector("#username");

	user = username.value;

	fetch('usuario/enviacode?user=' + user, {
		method: 'GET'
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
			if (result == "Usuário não encontrado") {
				msgError(result);
				setTimeout(() => {
					conf.style.display = "block";
					verif.style.display = "none";
					alt.style.display = "none";
				}, 3000);
			}
			if (result == "Codigo enviado com sucesso...") {
				msgSuccess(result);
				setTimeout(() => {
					conf.style.display = "none";
					verif.style.display = "block";
					alt.style.display = "none";
				}, 3000);
			}
		})
		.catch(error => {
			console.log(error);
		});
})

formverif.addEventListener("submit", function(event) {
	event.preventDefault();

	let codigos = document.querySelector("#codigo");

	codigo = codigos.value;

	fetch('usuario/verifcode?user=' + user + "&codigo=" + codigo, {
		method: 'GET'
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
			if (result == "Codigo não confere, favor verificar") {
				msgError(result);
				setTimeout(() => {
					conf.style.display = "none";
					verif.style.display = "block";
					alt.style.display = "none";
				}, 3000);


			} else {
				msgSuccess(result);
				setTimeout(() => {
					conf.style.display = "none";
					verif.style.display = "none";
					alt.style.display = "block";
				}, 3000);
			}
		})
		.catch(error => {
			console.log(error);
		});
})

formalt.addEventListener("submit", function(event) {
	event.preventDefault();

	let password = document.querySelector("#confPassword");

	password = password.value;

	fetch('usuario/autsenha?user=' + user + "&codigo=" + codigo + "&password=" + password, {
		method: 'PUT'
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
			msgSuccess(result);
			setTimeout(() => {
				window.location.href = 'login'
			}, 3000);
		})
		.catch(error => {
			console.log(error);
		});
})

let newpassword = document.querySelector('#newPassword')

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