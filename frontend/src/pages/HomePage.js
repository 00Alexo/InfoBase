import NavBar from "../components/NavBar";
import { useLocation } from "react-router-dom";

const HomePage = ({userInfo}) => {
    const location = useLocation();

    return (
        <div>
            {location.pathname !== "/home" && <NavBar userInfo={userInfo}/>}
            <p> Welcome to InfoBase </p>
        </div>
    );
}
 
export default HomePage;