import { UNSAFE_ErrorResponseImpl } from "@remix-run/router";
import { string } from "prop-types";
import React from "react";

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			email: null,
			password: null,
			token: null,
			message: null,
		},
		actions: {

			syncTokenFromLocalStorage: () => {
				const token = localStorage.getItem("token");
				console.log("application just loaded")
				if (token && token != "" && token != undefined) setStore({ token: token });
			},
			logout: () => {
				localStorage.removeItem("token");
				console.log("login out");
				setStore({ token: null });
				setStore({ message: null })
			},
			login: async (email, password, setAlertMessage, navigate) => {
				try {
					const options = {
						method: 'POST',
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							"email": email,
							"password": password
						})
					};

					const response = await fetch('https://probable-goldfish-5gqp59qp465r2v64-3001.app.github.dev/api/token', options);
					const data = await response.json();

					if (data.msg === "The email and password are required") {

						setAlertMessage(
							<div className="alert alert-warning">
								Email and password are required
							</div>)
					} else if (data.msg === "The email and password are incorrect") {

						setAlertMessage(
							<div className="alert alert-warning">
								Incorrect email or password
							</div>)
					} else if (data.user_id) {
						localStorage.setItem("token", data.access_token);
						setStore({ token: data.access_token });
						navigate("/private");
					}
				} catch (error) {
					console.error("Error during login:", error);
					setAlertMessage("There was an error logging in. Please try again later.");
				}
			},

			// En tu flux
			SignUp: async (email, password, setAlertMessage, setEmail, setPassword) => {
				try {
					const options = {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							email: email,
							password: password
						})
					};
					const response = await fetch("https://probable-goldfish-5gqp59qp465r2v64-3001.app.github.dev/api/create/user", options);
					const data = await response.json();
					const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

					if (data.msg === "The email is already in use") {
						setAlertMessage(
							<div className="alert alert-warning">
								The email is already in use
							</div>
						);
					}
					else if (data.msg === "User created successfully") {
						setAlertMessage(
							<div className="alert alert-success">
								User created successfully
							</div>
						);
						// Limpiar los campos de entrada después de que se haya creado exitosamente el usuario
						setEmail("");
						setPassword("");
					}
					else if (!emailPattern.test(email)) {
						setAlertMessage(
							<div className="alert alert-warning">
								Please enter a valid email address
							</div>
						)
					}

				} catch (error) {
					throw error; 
				}
			},
			
			getMessage: () => {
				const store = getStore();
				const opts = {
					method: 'GET',
					headers: {
						"Authorization": "Bearer " + store.token,
						"Content-Type": "application/json"
					}
				};
				// fetching data from the backend
				fetch('https://probable-goldfish-5gqp59qp465r2v64-3001.app.github.dev/api/private', opts)
					.then(resp => resp.json())
					.then(data => {
						console.log(data)
						setStore({ message: data.message })
					})
					.catch(error => console.log("Error loading message from backend", error));
			},



		}
	};
};

export default getState;
