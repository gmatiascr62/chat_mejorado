var amigos = document.getElementsByClassName('amigos');
const enviar = document.getElementById('sendBtn');
const mensaje = document.getElementById('mensaje');
const alerta = document.getElementById('alerta');
const historial = false;
var eventos;
var socket = io();
var destino;
var usuarioConectado;

cargaBotonesAmigos();

socket.on('connect', () =>{
        socket.emit('message', 'se conecto');
});

socket.on('resumen_user', (data) =>{
        usuarioConectado = data[0];
	if (data[1] != ""){
		eventos = data[1];
		alerta.classList.add('amarillo');
	};
});


enviar.addEventListener('click', () =>{
	if (destino != undefined){
		socket.emit('my event', usuarioConectado, mensaje.value, destino);
		mensaje.value = "";
		mensaje.focus();
	}else{
		alert("No hay ningun chat seleccionado");
		mensaje.value = "";
	};
});

alerta.addEventListener('click', () =>{
	texto.innerHTML = "";
	var fila = document.createElement('p');
	const boton = document.createElement('button');
	var txt = document.createElement('input');
	const separador = document.createElement('hr')
	texto.appendChild(fila);
	texto.appendChild(txt);
	texto.appendChild(boton);
	texto.appendChild(separador);
	fila.innerHTML = "Agregar usuario";
	boton.textContent = "Agregar";
	if (eventos != undefined){
		var nfila = document.createElement('p');
		var nboton = document.createElement('button');
		var nbotonDos = document.createElement('button');
		var separadorDos = document.createElement('hr');
		texto.appendChild(nfila);
		texto.appendChild(nboton);
		texto.appendChild(nbotonDos);
		texto.appendChild(separadorDos);
		nfila.innerHTML = `nueva solicitud de ${eventos}`;
		nboton.textContent = "Aceptar";
		nbotonDos.textContent = "Rechazar";
	};
	boton.addEventListener('click', () =>{
		if (txt.value != ""){
			socket.emit('envContacto', txt.value, usuarioConectado);
			txt.value = "";
		};
	});
	nboton.addEventListener('click', () => {
		console.log(eventos);
		socket.emit('aceptarUsuario', eventos[0]);
	});
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
	if (data[0] === usuarioConectado) {
		texto.appendChild(fila);
		fila.classList.add("row", "justify-content-end");
		columna.classList.add("col-7","bg-info", "m-2", "rounded-4");
		hora.classList.add('small');
	};
	if (data[2] === usuarioConectado && data[0] === destino) {
		texto.appendChild(fila);
		fila.classList.add("row", "justify-content-start");
		columna.classList.add("col-7","bg-warning", "m-2", "rounded-4");
		hora.classList.add('small');
	};
	if (data[2] === usuarioConectado && destino !== data[0]){
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

