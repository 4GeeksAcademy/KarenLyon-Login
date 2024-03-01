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
    email = body.get('email', '').strip()
    password = body.get('password', '').strip()

    # Validación del formato del correo electrónico
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        return jsonify({'msg': 'Please enter a valid email address'}), 400

    new_user = User(
        email=email,
        password=password  
    )
    
    if User.query.filter_by(email=email).first():
        return jsonify({'msg': 'The email is already in use'}), 400

    db.session.add(new_user)

    try:
        db.session.commit()
        return jsonify({'msg': "User created successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'msg': f'Error creating user: {str(e)}'}), 500

    

@api.route("/private", methods=["GET"])
@jwt_required()
def get_private():

    dictionary = { 
        "message" : "Now you can see everything"
        }
    return jsonify(dictionary)


