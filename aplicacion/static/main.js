var amigos = document.getElementsByClassName('amigos');
const aContancto = document.getElementById('aContancto');
const aceptar = document.getElementById('acp');
const rechazar = document.getElementById('rcz');
const solAmigo = document.getElementById('cu_user');
const enviar = document.getElementById('sendBtn');
const mensaje = document.getElementById('mensaje');
const agregar = document.getElementById('agregar');
const historial = false;
var socket = io();
var destino;
var usuarioConectado;
cargaBotonesAmigos();


socket.on('connect', () =>{
        socket.emit('message', 'se conecto');
});

socket.on('resumen_user', (data) =>{
        usuarioConectado = data;
});

enviar.addEventListener('click', () =>{
	socket.emit('my event', usuarioConectado, mensaje.value, destino);
	mensaje.value = "";
	mensaje.focus();
});


agregar.addEventListener('click', () =>{
	if (aContancto.value != ""){
		socket.emit('envContacto', aContancto.value, usuarioConectado);
		aContancto.value = "";
	};
});

socket.on('respEnvContacto', (data) =>{
	alert(data);
});

socket.on('respAceptaUser', (data) =>{
        location.reload(true);
});

socket.on('carga_chat', (data) =>{
	if (historial == false){
		for (let i = 0; i<data.length; i++){
			var etiquet = document.createElement('h3');
			etiquet.innerHTML = data[i][1];
			texto.appendChild(etiquet);
			if (data[i][0] == usuarioConectado){
				etiquet.classList.add("msgMio");
			}else{
				etiquet.classList.add("msgOtro");
			};
		};
	};
	texto.scrollTop=9999;
});

socket.on('mande', (data) =>{
	if (data[0] == usuarioConectado) {
		var etiqueta = document.createElement('h3');
		etiqueta.innerHTML = data[1];
		texto.appendChild(etiqueta);
		etiqueta.classList.add('msgMio');

	};
	if (data[2] == usuarioConectado && data[0] == destino) {
		var etiqueta = document.createElement('p');
		etiqueta.innerHTML = data[1];
		texto.appendChild(etiqueta);
		etiqueta.classList.add('msgOtro');
	};
	if (data[2] == usuarioConectado && destino != data[0]){
		for(let i=0;i<amigos.length; i++){
			if (amigos[i].textContent == data[0]){
				amigos[i].classList.add('menSinLeer');
			};
    		};
	};
	texto.scrollTop=9999;
	setTimeout(window.scrollTo(0,500),100);
});

if (document.body.contains(solAmigo) == true){
	alert('entro al if');
	aceptar.addEventListener('click', () =>{
		alert('aceptaususario');
		socket.emit('aceptarUsuario', solAmigo.textContent);
	});
};

function cargaBotonesAmigos(){
	for (let i = 0; i < amigos.length; i++){
    		amigos[i].addEventListener("click", () =>{
        		destino = amigos[i].textContent;
			for(let i=0;i<=amigos.length-1; i++){
				amigos[i].classList.remove("oscuro");
				amigos[i].classList.remove('menSinLeer');
			};
			amigos[i].classList.add("oscuro");
			texto.innerHTML = "";
			socket.emit('obtener', usuarioConectado, amigos[i].textContent);
    		});
	};
};

