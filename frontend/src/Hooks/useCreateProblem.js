import {useState} from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';

export const useCreateProblem = () => {
    const {user} = useAuthContext();
    const [error, setError] = useState(null);
    const [errorFields, setErrorFields] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const createProblem = async (title, description, difficulty, tags, cerinta, DateDeIntrare, DateDeIesire, Restrictii, Precizari, Exemple, Teste) => {
        setError(null);
        setErrorFields([]);
        setIsLoading(true);
        console.log('Creating problem with:', {title, description, difficulty, tags, cerinta, DateDeIntrare, DateDeIesire, Restrictii, Precizari, Exemple, Teste});
        console.log('Tags structure:', JSON.stringify(tags, null, 2));

        if (!user) {
            setError('You must be logged in to create a problem');
            setIsLoading(false);
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_API}/problems/createProblem`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`
            },
            body: JSON.stringify({
                title, 
                description, 
                difficulty, 
                tags, 
                cerinta, 
                creator: user.username,
                DateDeIntrare, 
                DateDeIesire, 
                Restrictii, 
                Precizari, 
                Exemple,
                Teste
            })
        });

        const json = await response.json();

        if(!response.ok){
            console.log(json.error);
            setIsLoading(false);
            setError(json.error);
            if (json.errorFields) {
                setErrorFields(json.errorFields);
            }
        }
        if(response.ok){
            setIsLoading(false);
            console.log('Problem created successfully:', json);
            navigate('/home', { state: { fromCreateProblem: true } });
        }
    }

    return { createProblem, error, isLoading, errorFields };
}