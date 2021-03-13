from flask_user import login_required, SQLAlchemyAdapter, UserManager, UserMixin
from backupMain import db
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), unique=True)
    password = db.Column(db.String(255), nullable=False, server_default='')
    firstname = db.Column(db.String(255), nullable=False, server_default='')
    lastname = db.Column(db.String(255), nullable=False, server_default='')
    affiliate = db.relationship('Affiliate', backref = db.backref('users'))
    roles = db.relationship('Role', secondary='user_roles',backref=db.backref('users', lazy='dynamic'))

class Role(db.Model):
        id = db.Column(db.Integer(), primary_key=True)
        name = db.Column(db.String(50), unique=True)

class UserRoles(db.Model):
        id = db.Column(db.Integer(), primary_key=True)
        user_id = db.Column(db.Integer(), db.ForeignKey('user.id', ondelete='CASCADE'))
        role_id = db.Column(db.Integer(), db.ForeignKey('role.id', ondelete='CASCADE'))

class Affiliate(db.Model):
        id = db.Column(db.Integer(), primary_key=True)
        name = db.Column(db.String(255), unique=True)