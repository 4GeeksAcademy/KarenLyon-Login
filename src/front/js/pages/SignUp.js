import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export const SignUp = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState();

    const handleSignUp = async () => {
   actions.SignUp(email, password, setAlertMessage, setEmail, setPassword);
    }
    
    

    return (
        <div className="text-center mt-5">
            <h1>Sign up</h1>
            {!store.token && (
                <div>
                    <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    /> <br/><br/>
                    <button onClick={handleSignUp}>
                        Sign Up
                    </button>
                    {alertMessage}
                </div>
            )}
        </div>
    );
};
