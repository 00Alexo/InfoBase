import { useSignIn } from "../Hooks/useSignIn";
import { useAuthContext } from "../Hooks/useAuthContext";
import { useState } from "react";
import { Button, Checkbox, Input } from "@heroui/react";
import { FaGithub, FaGoogle, FaDiscord } from "react-icons/fa";
import AuthShowcase from "../components/AuthShowcase";
import { Link } from "react-router-dom";

const SignIn = () => {
    const { signin, error, isLoading, errorFields } = useSignIn();
    const { user } = useAuthContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signin(username, email, password, confirmPassword);
    };

    return (                   
        <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-67px)]">
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 lg:p-8 h-full">
                <div className="flex flex-col w-full max-w-md items-center gap-6">
                    <p className="text-white text-3xl sm:text-4xl font-bold mb-6"> SIGN IN</p>
                    <div className="w-full flex flex-col gap-3">        
                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <button
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-white transition-colors duration-200"
                            >
                                <FaGithub className="text-lg sm:text-xl" />
                                <span className="text-sm sm:text-base">GitHub</span>
                            </button>
                            
                            <button
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-gray-800 transition-colors duration-200"
                            >
                                <FaGoogle className="text-lg sm:text-xl text-red-500" />
                                <span className="text-sm sm:text-base">Google</span>
                            </button>
                            
                            <button
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 rounded-lg text-white transition-colors duration-200"
                            >
                                <FaDiscord className="text-lg sm:text-xl" />
                                <span className="text-sm sm:text-base">Discord</span>
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-4 my-4">
                            <div className="flex-1 h-px bg-gray-600"></div>
                            <span className="text-gray-400 text-sm">or</span>
                            <div className="flex-1 h-px bg-gray-600"></div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3 mb-3 mt-3">
                        <div className="flex flex-col gap-2 w-full">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 bg-transparent border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primaryCustom focus:outline-none transition-colors duration-200 hover:border-gray-500"
                                placeholder="Username or Email"
                            />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-transparent border-2 border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-primaryCustom focus:outline-none transition-colors duration-200 hover:border-gray-500"
                                placeholder="Password"
                            />          
                        </div>
                    </form>
                    <div className="w-full flex flex-col gap-3 mt-2">
                        <div className="flex flex-row w-full justify-between items-start sm:items-center gap-3 sm:gap-0">
                            <div className="text-gray-400 flex items-center gap-2">
                                <Checkbox className="text-gray-400"/>
                                <span className="text-sm sm:text-base">Remember me</span>
                            </div>
                            <p className="text-gray-400 text-sm sm:text-base cursor-pointer hover:text-primaryCustom"> Forgot password? </p>
                        </div>

                        <div className="w-full">
                            <Button color="infobase" variant="flat"
                                className="bg-gradient-to-r from-primaryCustom to-primaryCustomHover w-full">
                                Submit
                            </Button>
                        </div>

                        <p className="text-center"> Don't have an account? 
                            <Link to="/signup" className="text-primaryCustom ml-1 cursor-pointer transition-all duration-300 hover:text-primaryCustomHover"> 
                            Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
            <AuthShowcase />
        </div>
    );
}
 
export default SignIn;