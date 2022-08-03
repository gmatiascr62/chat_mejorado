from aplicacion import db
from aplicacion.models import Usuarios, Mensajes

'''
eventos:
    1_solicitud de amistad : 1_usuario_|_

'''

def resumen_usuario(tipo, nombre):
    user = Usuarios.query.filter_by(username=nombre).first()
    if tipo == 'solicitudes':
        cadena = user.eventos
        if cadena == None:
            return []
        cadena = cadena.split("_|_")
        cadena_unica = []
        for i in cadena:
            if i not in cadena_unica:
                if i != "":
                    cadena_unica.append(i)
        cadena_final = []
        for i in cadena_unica:
            if i[0] == "1":
                cadena_final.append(i[2:])
        return cadena_final
    if tipo == "amigos":
        cadena = user.amigos
        if cadena == None:
            return []
        cadena = cadena.split("_|_")
        cadena_unica = []
        for i in cadena:
            if i not in cadena_unica:
                if i != "":
                    cadena_unica.append(i)
        print(cadena_unica)
        return cadena_unica

def invitar_amigo(usuario, quiere_agregar):
    user = Usuarios.query.filter_by(username=quiere_agregar).first()
    if user == None:
        return "no existe ese usuario"
    elif usuario == quiere_agregar:
        return "no podes agregarte como amigo"
    else:
        if user.eventos == None:
            user.eventos = f'1_{usuario}_|_'
        else:
            user.eventos += f'1_{usuario}_|_'
        db.session.commit()
        print(user.eventos)
        return f'solicitud enviada a {quiere_agregar}'

def agregar_amigo(usuario, agrega):
    user = Usuarios.query.filter_by(username=usuario).first()
    if user.amigos == None:
        user.amigos = f'{agrega}_|_'
    else:
        user.amigos += f'{agrega}_|_'
    db.session.commit()
    eventos = user.eventos
    if eventos != None:
        eventos = eventos.replace(f'1_{agrega}_|_', "")
        user.eventos = eventos
        db.session.commit()

def guardar(*args):
    if len(args) == 3:
        origenb = args[0]
        mensajeb = args[1]
        destinob = args[2]
        guardame = Mensajes(origen=origenb, mensaje=mensajeb, destino=destinob)
        db.session.add(guardame)
        db.session.commit()

def obtener_chat(origen, destino):
    lista_a=[origen, destino]
    lista_b=[destino, origen]
    todos = Mensajes.query.all()
    retornar = []
    for i in todos:
        comparar = [i.origen, i.destino]
        if comparar == lista_a or comparar == lista_b:
            retornar.append([i.origen, i.mensaje])
    return retornar
