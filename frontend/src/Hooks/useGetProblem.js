import { useState, useEffect } from "react";

export const useGetProblem = (uniqueId) => {
    const [error, setError] = useState(null);
    const [problem, setProblem] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const getProblem = async () => {
        setError(null);
        setIsLoading(true);

        const response = await fetch(`${process.env.REACT_APP_API}/problems/getProblem/${uniqueId}`, {
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
            setProblem(json);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (uniqueId) {
            getProblem();
        }
    }, [uniqueId]);

    const refetchProblem = () => {
        getProblem();
    };

    return { getProblem, refetchProblem, error, isLoading, problem };
}