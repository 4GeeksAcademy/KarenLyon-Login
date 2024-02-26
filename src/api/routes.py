"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required

api = Blueprint('api', __name__)


# # Allow CORS requests to this API
CORS(api)

@api.route("/token", methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    if not email or not password : 
       return jsonify({"msg": "email y password son requeridos"}) 
    user = User.query.filter_by(email = email, password=password).first()
    if not user : return jsonify({"msg": "email y password son incorrectos"})
    
    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token)

@api.route('/create/user', methods=['POST'])
def create_user():
    body = request.get_json()

    # Verificar si el correo electrónico ya está en uso
    if User.query.filter_by(email=body['email']).first():
        return jsonify({'message': 'El correo electrónico ya está en uso'}), 400

    # Crear un nuevo usuario
    new_user = User(
        email=body['email'],
        password=body['password']  # Asegúrate de cifrar la contraseña antes de guardarla en la base de datos!
    )
    db.session.add(new_user)
    
    try:
        db.session.commit()
        return jsonify({'response': 'ok'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'Error al crear el usuario: {str(e)}'}), 400
    

@api.route("/hello", methods=["GET"])
@jwt_required()
def get_hello():

    dictionary = { 
        "message" : "hello world"
        }
    return jsonify(dictionary)

# es creado por esta la funcion create token

