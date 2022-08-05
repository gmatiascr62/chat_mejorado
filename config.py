import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    DEBUG = False
    SECRET_KEY = os.environ.get('secret')
    SQLALCHEMY_DATABASE_URI = 'postgresql://teqzadvo:bXM6zS-Vt-0Qzv-SvIHQa6YvUfNTRUD4@rosie.db.elephantsql.com/teqzadvo'
    SQLALCHEMY_TRACK_MODIFICATIONS = False


