import { useSignUp } from "../Hooks/useSignUp";
import { useAuthContext } from "../Hooks/useAuthContext";
import { useState } from "react";
import { Button, Checkbox, Input } from "@heroui/react";
import { FaGithub, FaGoogle, FaDiscord, FaEye, FaEyeSlash } from "react-icons/fa";
import AuthShowcase from "../components/AuthShowcase";
import { Link } from "react-router-dom";

const SignUp = () => {
    const { signup, error, isLoading, errorFields } = useSignUp();
    const { user } = useAuthContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(username, email, password, confirmPassword);
    };

    return (
        <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-67px)]">
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 lg:p-8 h-full relative">
                {error && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-md p-3 bg-red-900/30 border border-red-500 rounded-lg z-10">
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    </div>
                )}
                
                <div className="flex flex-col w-full max-w-md items-center gap-6">
                    <p className="text-white text-3xl sm:text-4xl font-bold mb-6"> SIGN UP</p>
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
                    
                    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3">
                        <div className="flex flex-col gap-2 w-full">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className={`w-full px-4 py-3 bg-transparent border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors duration-200 ${
                                    errorFields?.some(ef => ef.field === 'username') 
                                        ? 'border-red-600 hover:border-red-500 focus:border-red-500' 
                                        : 'border-gray-600 hover:border-gray-500 focus:border-primaryCustom'
                                }`}
                                placeholder="Username"
                            />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <input
                                type="email"       
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-4 py-3 bg-transparent border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors duration-200 ${
                                    errorFields?.some(ef => ef.field === 'email') 
                                        ? 'border-red-600 hover:border-red-500 focus:border-red-500' 
                                        : 'border-gray-600 hover:border-gray-500 focus:border-primaryCustom'
                                }`}
                                placeholder="Email"
                            />
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full px-4 py-3 pr-12 bg-transparent border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors duration-200 ${
                                        errorFields?.some(ef => ef.field === 'pass') 
                                            ? 'border-red-600 hover:border-red-500 focus:border-red-500' 
                                            : 'border-gray-600 hover:border-gray-500 focus:border-primaryCustom'
                                    }`}
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                    {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                                </button>
                            </div>                
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full px-4 py-3 pr-12 bg-transparent border-2 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors duration-200 ${
                                        errorFields?.some(ef => ef.field === 'cpass') 
                                            ? 'border-red-600 hover:border-red-500 focus:border-red-500' 
                                            : 'border-gray-600 hover:border-gray-500 focus:border-primaryCustom'
                                    }`}
                                    placeholder="Confirm Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                                >
                                    {showConfirmPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                                </button>
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-3 mt-6">
                            <div className="flex flex-row w-full justify-between items-start sm:items-center gap-3 sm:gap-0">
                                <div className="text-gray-400 flex items-center gap-2">
                                    <Checkbox className="text-gray-400"/>
                                    <span className="text-sm sm:text-base">Remember me</span>
                                </div>
                                <p className="text-gray-400 text-sm sm:text-base cursor-pointer hover:text-primaryCustom"> Forgot password? </p>
                            </div>

                            <div className="w-full">
                                <Button color="infobase" variant="flat" type="submit"
                                    className="bg-gradient-to-r from-primaryCustom to-primaryCustomHover w-full">
                                    Submit
                                </Button>
                            </div>

                            <p className="text-center"> Already have an account? 
                                <Link to="/signin" className="text-primaryCustom ml-1 cursor-pointer transition-all duration-300 hover:text-primaryCustomHover"> 
                                Sign In
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
            <AuthShowcase />
        </div>
    );
}
 
export default SignUp;