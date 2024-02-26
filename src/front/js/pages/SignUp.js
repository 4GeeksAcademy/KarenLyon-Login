import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export const SignUp = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignUp = () => {
        actions.SignUp(email, password); 
        navigate("/login")// Llama a la función SignUp del contexto y pasa el email y la contraseña
    };


    return (
        <div className="text-center mt-5">
            <h1>Sign up</h1>
            {store.token && store.token !== "" && store.token !== undefined ? (
                "You are logged in with this token" + store.token
            ) : (
                <div>
                    <input type="text" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* Llama a handleSignUp cuando se hace clic en el botón */}
                    <button onClick={handleSignUp}>
                        Sign Up
                    </button>
                </div>
            )}
        </div>
    );
};
