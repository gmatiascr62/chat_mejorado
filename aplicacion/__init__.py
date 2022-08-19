from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_socketio import SocketIO
from flask_admin import Admin

app = Flask(__name__)
app.config.from_object(Config)
db=SQLAlchemy(app)
login = LoginManager(app)
login.login_view = 'login'
socketio = SocketIO(app, cors_allowed_origins="*")
admin = Admin(app)

from aplicacion import routes, models
