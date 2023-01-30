const chartAtual = document.querySelectorAll(".chartAtual");
const chartAnteriores = document.querySelectorAll(".chartAnteriores");
let fadeAviso = document.querySelector('#fadeAviso');
let modalAviso = document.querySelector('#modalAviso');

let etiquetas = [];
let valores = [];
let etiquetasMedia = [];
let valoresMedia = [];

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


function categoriaPainel(){
	
	let tipo = ''
	
	$.ajax({
		method: "GET",
		url: "categorias/listacategoria?tipo="+tipo,
		timeout: 0,
		headers: {
			Authorization: localStorage.getItem("token")
		},
		success: function(response) {
			for (var i = 0; i < response.length; i++) {
				etiquetas.push(response[i][0])
				valores.push(response[i][1])
			}
		}
	}).fail(function(xhr, status, errorThrown) {
		if (xhr.status == 403) {
				msg = "Seu TOKEN está expirado ou está logado em outra máquina, faça o login ou informe um novo TOKEN PARA AUTENTICAÇÂO";
				fadeAviso.classList.toggle('hide')
				modalAviso.classList.toggle('hide')
				msgAviso(msg)
			}
	});
}

function categoriaPainelMedia(){
	
	$.ajax({
		method: "GET",
		url: "categorias/listacategoriaMedia",
		timeout: 0,
		headers: {
			Authorization: localStorage.getItem("token")
		},
		success: function(response) {
			for (var i = 0; i < response.length; i++) {
				etiquetasMedia.push(response[i][0])
				valoresMedia.push(response[i][1])
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
			}
	});
}

chartAtual.forEach(function (chart) {
	categoriaPainel();
  var ctx = chart.getContext("2d");
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
       labels: etiquetas,
      datasets: [
        {
          label: "# Mês Atual",
          data: valores,
          backgroundColor: [
            "rgb(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(47, 100, 100, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(47, 100, 100, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});

chartAnteriores.forEach(function (chart) {
	categoriaPainelMedia();
  	var ctx = chart.getContext("2d");
  	var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: etiquetasMedia,
      datasets: [
        {
          label: "# Média",
          data: valoresMedia,
          backgroundColor: [
			"rgba(54, 162, 235, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(47, 100, 100, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(54, 162, 235, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(47, 100, 100, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 2,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
});



const divMessage = document.querySelector(".avisos");

function msgAviso(msg) {
	const message = document.createElement("div");
	//message.classList.add("messageSucesso");
	message.innerText = msg;
	divMessage.appendChild(message);
}
