const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
          email: null,
		  password: null,
          token: null,
		  message: null,

		},
		actions: {

			syncTokenFromLocalStorage: ()=>{
				const token = localStorage.getItem("token");
				console.log("application just loaded")
				if (token && token !="" && token != undefined) setStore({token: token});
			},
			logout: ()=>{
				localStorage.removeItem("token");
				console.log("login out");
				setStore({token:null});
				setStore({message:null})
			},

			login: async (email, password) => {
				const options = {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						"email": email,
						"password": password
					})

				} ;try{
					const resp = await fetch('https://probable-goldfish-5gqp59qp465r2v64-3001.app.github.dev/api/token', options)
				if (resp.status !== 200) {
					alert("There has been some error");
					return false;
				}
			 const data = await resp.json();
				console.log("this came from the backend",data);
				localStorage.setItem("token", data.access_token);
				setStore({token : data.access_token})
			}
			catch(error){
					console.error("There was an error login in")
				}
		},
		SignUp: async (email, password) => {
			try {
				const response = await fetch("https://probable-goldfish-5gqp59qp465r2v64-3001.app.github.dev/api/create/user", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						email: email,
						password: password
					})
				});
				if (!response.ok) {
					throw new Error("Error registering user");
				}
				const data = await response.json();
				console.log("User registered successfully", data);
				// Handle successful response, e.g., redirect user to login page
				// navigate("/login");
			} catch (error) {
				console.error("Error:", error);
				// Handle error, show error message, etc.
			}
		},
		
		getMessage:() => {
			const store = getStore();
			const opts = {
				method : 'GET',
				headers :{
					"Authorization" : "Bearer " + store.token,
					"Content-Type": "application/json"
				}
			};
				// fetching data from the backend
			fetch('https://probable-goldfish-5gqp59qp465r2v64-3001.app.github.dev/api/hello', opts)
				.then (resp => resp.json())
				.then( data => {
					console.log(data)
					setStore({ message: data.message })
					})
		     	.catch (error => console.log("Error loading message from backend", error));
			},
		


	}
};
};

export default getState;
