import { useState, useEffect } from "react";

export const useGetProfile = (username) => {
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getProfile = async () => {
        setError(null);
        setIsLoading(true);

        const response = await fetch(`${process.env.REACT_APP_API}/user/getProfile/${username}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        const json = await response.json();

        if(!response.ok){
            console.log(json.error);
            setIsLoading(false);
            setError(json.error);
        }

        if(response.ok){
            setProfile(json);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (username) {
            getProfile();
        }
    }, [username]);

    const refetchProfile = () => {
        getProfile();
    };

    return { getProfile, refetchProfile, error, isLoading, profile };
}