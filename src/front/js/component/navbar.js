import React, {useContext} from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {

	const { store, actions } = useContext(Context);
	const navigate = useNavigate()

	return (

		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					{!store.token ?
						<Link to="/login">
							<button className="btn btn-primary">log in</button>
						</Link> :
						<Link to="/login">
						<button onClick={()=> actions.logout()}className="btn btn-primary">log out</button>
					</Link>
					}
					<button onClick={()=> navigate("/SignUp")}className="btn btn-primary">Sign up</button>
				</div>
			</div>
		</nav>
	);
};
