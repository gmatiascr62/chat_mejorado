var amigos = document.getElementsByClassName('amigos');
const aContancto = document.getElementById('aContancto');
const aceptar = document.getElementById('acp');
const rechazar = document.getElementById('rcz');
const solAmigo = document.getElementById('cu_user');
const enviar = document.getElementById('sendBtn');
const mensaje = document.getElementById('mensaje');
const agregar = document.getElementById('agregar');
const alerta = document.getElementById('alerta');
const eventos = document.getElementById('eventos');
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

alerta.addEventListener('click', () =>{
	eventos.classList.toggle('mover');
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
			var fila = document.createElement('div');
			var columna = document.createElement('div');
			var mens = document.createElement('h3');
			var hora = document.createElement('h6');
			mens.innerHTML = data[i][1];
			hora.innerHTML = data[i][2];
			columna.appendChild(mens);
			columna.appendChild(hora);
			fila.appendChild(columna);
			texto.appendChild(fila);
			console.log(columna);
			if (data[i][0] == usuarioConectado){
				fila.classList.add("row", "justify-content-end");
				columna.classList.add("col-7","bg-info", "m-2", "rounded-4");
				hora.classList.add('small');
			}else{
				fila.classList.add("row", "justify-content-start");
				columna.classList.add("col-7","bg-warning", "m-2", "rounded-4");
				hora.classList.add('small');
			};
		};
	};
	texto.scrollTop=9999;
});

socket.on('mande', (data) =>{
	
	var fila = document.createElement('div');
    	var columna = document.createElement('div');
    	var mens = document.createElement('h3');
    	var hora = document.createElement('h6');
    	mens.innerHTML = data[1];
    	hora.innerHTML = data[3];
    	columna.appendChild(mens);
    	columna.appendChild(hora);
    	fila.appendChild(columna);
    	texto.appendChild(fila);
	if (data[0] == usuarioConectado) {
		fila.classList.add("row", "justify-content-end");
		columna.classList.add("col-7","bg-info", "m-2", "rounded-4");
		hora.classList.add('small');
	};
	if (data[2] == usuarioConectado && data[0] == destino) {
		fila.classList.add("row", "justify-content-start");
		columna.classList.add("col-7","bg-warning", "m-2", "rounded-4");
		hora.classList.add('small');
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
	aceptar.addEventListener('click', () =>{
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

