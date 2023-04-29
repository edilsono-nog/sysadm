let username = document.querySelector("#Username");
let password = document.querySelector("#Password");
let form = document.querySelector("#form");
let divMessage = document.querySelector(".alert");
let btn = document.querySelector('.fa-eye');

document.addEventListener('keypress', function(e) {
	if(e.key === 'Enter'){
		const btns = document.querySelector('.btn');
		btns.click();
	}
})

form.addEventListener("submit", function(event){
  event.preventDefault();

  let dados = {
    login: username.value,
    senha: password.value
  }

  fetch('login1', {
    method: 'POST',
    body: JSON.stringify(dados),
  })
  .then(response => {
    if(response.status == 200){
      return response.text();
    }
    if(response.status == 403){
      throw Error(response.statusText);
    }    
  })
  .then(result => {
    token = result.replace('{"Authorization": "', '');
    token = token.replace('"}', '');
    localStorage.setItem("token",  token);
    let jsession = Math.random().toString(16).substr(2) + Math.random().toString(16).substr(2)
    var d = new Date();
	var v = new Date();
	var s = new Date();
	v.setMinutes(d.getMinutes()+30);
//	setCookie('JSESSIONIDSYSADM', jsession, 0.5)
	Cookies.set('SysAdm', jsession, { expires: v });
//	Cookies.set('JSESSIONIDSs', jsession, { expires: s });
    pegaUsuario(username.value);
    window.location='dashboard';
  })
  .catch(error => {
    localStorage.removeItem("token");
    localStorage.removeItem("userLogado");
   // Cookies.remove('JSESSIONIDSYSADM');
		const msg = "Usuário e/ou senha inválido: ";
		ativar(msg);
  });
})

function ativar(msg) {
  const message = document.createElement("div");
  message.classList.add("message");
  message.innerText = msg;
  divMessage.appendChild(message);

  setTimeout(() => {
      message.style.display = "none";
  }, 3000);
}

function setCookie(nome,valor,days) {
    var validade = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        validade = "; expires=" + date.toUTCString();
    }
    document.cookie = nome + "=" + (valor || "")  + validade + "; path=/";
}

btn.addEventListener('click', ()=>{
  let inputSenha = document.querySelector('#Password')

  if(inputSenha.getAttribute('type')  == 'password'){
      inputSenha.setAttribute('type', 'text')
  }else{
      inputSenha.setAttribute('type', 'password')
  }
})

function pegaUsuario(nome){
  var myHeaders = new Headers();
  myHeaders.append("Authorization", localStorage.getItem("token"));

  let listaUser = []
	
	let userValid = {
        name: '',
        user: '',
        senha: ''
    }

  fetch('usuario/buscarPorNome?name='+nome, {
    method: 'GET',
    headers: myHeaders
  })
  .then(response => response.json())
  .then(result => {
      listaUser = result;
			listaUser.forEach((item) =>{
				userValid = {
			    name: item.nome,
			    user: item.login,
			    senha: item.senha
				}
			})
				
			localStorage.setItem('userLogado',JSON.stringify(userValid))
  })
  .catch(error => console.log('error', error));
}