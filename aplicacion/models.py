from aplicacion import db, login
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class Usuarios(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    password_hash = db.Column(db.String(128))
    amigos = db.Column(db.String(300))
    eventos = db.Column(db.String(84))

    def __repr__(self):
        return '<Usuarios {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

@login.user_loader
def load_user(id):
    return Usuarios.query.get(int(id))

class Mensajes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    origen = db.Column(db.String(20))
    mensaje = db.Column(db.String(84))
    destino = db.Column(db.String(20))
    hora = db.Column(db.String(20))

    def __repr__(self):
        return '<User {}>'.format(self.username)

