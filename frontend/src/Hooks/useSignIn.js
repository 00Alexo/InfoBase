import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

export const useSignIn = () => {
    const [error, setError] = useState(null);
    const [errorFields, setErrorFields] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { dispatch } = useAuthContext();

    const signin = async (username, password) => {
        setError(null);
        setErrorFields(null);
        setIsLoading(true);

        const response = await fetch(`${process.env.REACT_APP_API}/user/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const json = await response.json();

        if (!response.ok) {
            console.log(json.error);
            setIsLoading(false);
            setError(json.error);
            setErrorFields(json.errorFields);
        }
        if (response.ok) {
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({ type: 'LOGIN', payload: json });
            setIsLoading(false);
            navigate('/home', { state: { fromSignIn: true } });
        }
    };

    return { signin, error, isLoading, errorFields };
}
