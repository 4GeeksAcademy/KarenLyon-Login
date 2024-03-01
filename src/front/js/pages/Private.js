import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Private = () => {
    const { store, actions } = useContext(Context);
    const token = store.token;

    useEffect(() => {
        if (token && token !== "" && token !== undefined) {
            actions.getMessage();
        }
    }, [token]);

    // Si el token existe y no es vacío ni undefined, mostrar el contenido del componente Private
    if (token && token !== "" && token !== undefined) {
        return (
            <div className="text-center mt-5">
                <h1>Welcome to the secret place</h1>
                <p>
                    <img src="https://th.bing.com/th/id/OIG3.FCeI3OG4vTK0iiXCrWN6?pid=ImgGn" style={{ width: '300px' }} />
                </p>
                <div className="alert alert-info">
                    {store.message}
                </div>
                <p>
                    This boilerplate comes with lots of documentation:{" "}
                    <a href="https://start.4geeksacademy.com/starters/react-flask">
                        Read documentation
                    </a>
                </p>
            </div>
        );
    } else {
        // Si el usuario no ha iniciado sesión, puedes redirigirlo a la página de inicio de sesión o mostrar un mensaje de error.
        return (
            <div className="text-center mt-5">
                <h1>You need to login to access this page</h1>
                {/* Puedes incluir aquí un botón o enlace para que el usuario vaya a la página de inicio de sesión */}
            </div>
        );
    }
};
