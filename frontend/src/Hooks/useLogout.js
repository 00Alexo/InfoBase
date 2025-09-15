import {useAuthContext} from './useAuthContext'
import { useNavigate } from 'react-router-dom';


export const useLogout = () =>{
    const navigate = useNavigate();
    const {dispatch} = useAuthContext();
    
    const logout = () => {;
        localStorage.removeItem('user');

        dispatch({type: 'LOGOUT'})

        navigate('/signin');
    }
    
    return {logout};
}