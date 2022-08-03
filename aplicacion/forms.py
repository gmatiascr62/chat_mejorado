from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField 
from wtforms.validators import DataRequired, EqualTo, ValidationError
from aplicacion.models import Usuarios

class Registro(FlaskForm):
    username = StringField('Usuario', render_kw={'style': 'font-size: 2rem'}, validators=[DataRequired()])
    password = PasswordField('Contraseña',render_kw={'style': 'font-size: 2rem'}, validators=[DataRequired()])
    password2 = PasswordField('Repita Contraseña', render_kw={'style': 'font-size: 2rem'}, validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Registrar', render_kw={'style': 'font-size: 2rem'})
    
    def validate_username(self, username):
        user = Usuarios.query.filter_by(username=username.data).first()
        if user is not None:
            raise ValidationError('Usuario existente')

class Login(FlaskForm):
    username = StringField('Usuario',render_kw={'style': 'font-size: 2rem'}, validators=[DataRequired()])
    password = PasswordField('Contraseña',render_kw={'style': 'font-size: 2rem'}, validators=[DataRequired()])
    remember_me = BooleanField('Recordame', render_kw={'style': 'font-size: 2rem'})
    submit = SubmitField('Iniciar Sesion', render_kw={'style': 'font-size: 2rem'})



