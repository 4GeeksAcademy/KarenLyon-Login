const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {

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

		getMessage: async () => {
			const store = getStore();
			const opts = {
				headers :{
					"Authorization" : "Bearer" + store.token
				}
			}
			try {
				// fetching data from the backend
				const resp = await fetch(process.env.BACKEND_URL + "api/hello", opts)
				const data = await resp.json()
				setStore({ message: data.message })
				// don't forget to return something, that is how the async resolves
				return data;
			} catch (error) {
				console.log("Error loading message from backend", error)
			}
		},

		changeColor: (index, color) => {
			//get the store
			const store = getStore();

			//we have to loop the entire demo array to look for the respective index
			//and change its color
			const demo = store.demo.map((elm, i) => {
				if (i === index) elm.background = color;
				return elm;
			});

			//reset the global store
			setStore({ demo: demo });
		}

	}
};
};

export default getState;
