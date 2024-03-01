import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export const Login = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState();

    const handleClick = () => {
        actions.login(email, password,setAlertMessage, navigate);
    };

    useEffect(() => {
        if (store.token && store.token !== "" && store.token !== undefined) {
            navigate("/private");
        }
    }, [store.token, navigate]);

console.log(alertMessage)

    return (
        <div className="text-center mt-5">
            <h1>Log in</h1>
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
                    /> <br></br><br></br>
                    <button onClick={handleClick}>
                        Login
                    </button>
                    {alertMessage}
                </div>
            )}
        </div>
    );
};
