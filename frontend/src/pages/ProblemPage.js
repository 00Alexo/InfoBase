import { Link, useParams } from "react-router-dom";
import { useGetProblem } from "../Hooks/useGetProblem";
import NotFound from "./NotFound";

const ProblemPage = () => {
    const { uniqueId } = useParams();
    const { getProblem, refetchProblem, error, isLoading, problem } = useGetProblem(uniqueId);

    if(error == "Problem not found!"){
        return (
            <main className="min-h-[70vh] flex flex-col items-center justify-center bg-light p-4 z-30 relative">
            <div className="flex flex-col items-center space-y-4">
                <h1 className="bi bi-link-45deg text-6xl"></h1>
                <h1 className="text-5xl">404</h1>
                <h2 className="text-4xl font-bold text-slate-300">Oops, problem not found.</h2>
                <p className="text-slate-300">
                The problem you are looking for does not exist. It might have been moved or deleted.
                </p>
                <button className="bg-white text-black py-2 px-4 border rounded border-gray-300 hover:bg-gray-200">
                <Link className='no-underline text-black' to="/">
                    Go back home
                </Link>
                </button>
            </div>
            </main>
        );
    }

    return (
        <div className="flex flex-row">
            <div className="w-1/2 ">
                test
            </div>
            <div className="w-1/2">
                test
            </div>
        </div>
    );
}
 
export default ProblemPage;

{/* <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                    true
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-primaryCustom/20 text-primaryCustom border border-primaryCustom/30'
                }`}
            >
                'name'
            </span> */}
