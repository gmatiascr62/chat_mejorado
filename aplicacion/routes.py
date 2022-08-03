from aplicacion import app, db
from flask import render_template, redirect, url_for, flash, request
from aplicacion.forms import Login, Registro
from aplicacion.models import Usuarios
from flask_login import login_user, logout_user, current_user, login_required
from werkzeug.urls import url_parse
from aplicacion.funciones import agregar_amigo, invitar_amigo, resumen_usuario, guardar, obtener_chat
from flask_socketio import SocketIO, emit

socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
@login_required
def index():
    if current_user.is_authenticated:
        solicitud = resumen_usuario("solicitudes", current_user.username)
        return render_template('index.html', username=current_user.username, amigos=resumen_usuario("amigos", current_user.username), solicitud=solicitud)
    else:
        return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        print(current_user.username)
        return redirect(url_for('index'))
    form = Login()
    if form.validate_on_submit():
        user = Usuarios.query.filter_by(username=form.username.data).first()
        if user is None or not user.check_password(form.password.data):
            flash('Contraseña o nombre de usuario invalido')
            return redirect(url_for('login'))
        login_user(user, remember=form.remember_me.data)
        next_page = request.args.get('next')
        if not next_page or url_parse(next_page).netloc != '':
            next_page = url_for('index')
        return redirect(next_page)
    return render_template('login.html', form=form)

@app.route('/registro', methods=['GET', 'POST'])
def registro():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = Registro()
    if form.validate_on_submit():
        user = Usuarios(username=form.username.data)
        user.set_password(form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('Usuario registrado!')
        return redirect(url_for('login'))
    return render_template('registro.html', form=form)

#SocketIO
@socketio.on('message')
def test_connect(msg):
    print(msg, current_user)
    emit('resumen_user', current_user.username)

@socketio.on('envContacto')
def envContacto(*args):
   yo = args[1]
   quiero = args[0]
   agregando = invitar_amigo(yo, quiero)
   print("agregando", agregando)
   emit('respEnvContacto', agregando)

@socketio.on('aceptarUsuario')
def aceptarUsuario(data):
    amigo = data[13:]
    yo = current_user.username
    agregar_amigo(yo, amigo)
    agregar_amigo(amigo, yo)
    emit('respAceptaUser', 'usuario aceptado')

@socketio.on('my event')
def my_event(*args):
    guardar(*args)
    lista = []
    for i in args:
        lista.append(i)
    print("argumentos: ", lista)
    emit('mande', lista, broadcast=True)

@socketio.on('obtener')
def obtener(*args):
    print("entro a obtener: ",args)
    chat = obtener_chat(args[0],args[1])
    emit('carga_chat', chat)
