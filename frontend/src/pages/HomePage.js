import NavBar from "../components/NavBar";
import { useLocation } from "react-router-dom";

const HomePage = () => {
    const location = useLocation();

    return (
        <div>
            {location.pathname !== "/home" && <NavBar />}
            <p> Welcome to InfoBase </p>
        </div>
    );
}
 
export default HomePage;