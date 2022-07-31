from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField 
from wtforms.validators import DataRequired, EqualTo

class Registro(FlaskForm):
    username = StringField('Usuario', render_kw={'style': 'font-size: 3rem'}, validators=[DataRequired()])
    password = PasswordField('Contraseña',render_kw={'style': 'font-size: 3rem'}, validators=[DataRequired()])
    password2 = PasswordField('Repita Contraseña', render_kw={'style': 'font-size: 3rem'}, validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Registrar', render_kw={'style': 'font-size: 3rem'})


class Login(FlaskForm):
    username = StringField('Usuario',render_kw={'style': 'font-size: 3rem'}, validators=[DataRequired()])
    password = PasswordField('Contraseña',render_kw={'style': 'font-size: 3rem'}, validators=[DataRequired()])
    remember_me = BooleanField('Recordame', render_kw={'style': 'font-size: 3rem'})
    submit = SubmitField('Iniciar Sesion', render_kw={'style': 'font-size: 3rem'})



