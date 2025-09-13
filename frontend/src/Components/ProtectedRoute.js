import { useAuthContext } from '../hooks/useAuthContext';
import { Navigate } from 'react-router-dom';
import SignIn from '../pages/SignIn';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuthContext();
    
    if (!user) {
        return <SignIn/>;
    }
    
    return children;
};

export default ProtectedRoute;
