"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
import re
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
       return jsonify({"msg": "The email and password are required"}) 
    user = User.query.filter_by(email = email, password=password).first()
    if not user : return jsonify({"msg": "The email and password are incorrect"})
    
    access_token = create_access_token(identity= email)
    return jsonify({"access_token": access_token, "user_id": user.id })


@api.route('/create/user', methods=['POST'])
def create_user():
    body = request.get_json()
    
    new_user = User(
        email=body['email'],
        password=body['password']  
    )
    
    if User.query.filter_by(email=body['email']).first():
        return jsonify({'msg': 'The email is already in use'}), 400
    db.session.add(new_user)

    try:
        db.session.commit()
        return jsonify({'msg': "User created successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': f'Error al crear el usuario: {str(e)}'}), 500  # Cambiar el código de estado a 500 para indicar un error en el servidor

def is_valid_email(email):
       pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
       return re.match(pattern, email) is not None


    

@api.route("/private", methods=["GET"])
@jwt_required()
def get_private():

    dictionary = { 
        "message" : "Now you can see everything"
        }
    return jsonify(dictionary)

# es creado por esta la funcion create token

