import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import ProtectedRoute from './Components/ProtectedRoute';
import NavBar from './components/NavBar'
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import WelcomePage from './pages/WelcomePage';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import { useLocation } from 'react-router-dom';
import CreateProblem from './pages/CreateProblem';
import ProblemPage from './pages/ProblemPage';
import Compiler from './pages/Compiler';

function AppContent() {
  const location = useLocation();

  return (
    <div className="App bg-[#18191c] min-h-screen">
      {location.pathname === '/' || location.pathname === '/welcome' ? null : <NavBar />}
      <Routes> 
        <Route path = "*" element={<NotFound/>}/>
        <Route path = "/" element={<WelcomePage/>}/>
        <Route path = "/welcome" element={<WelcomePage/>}/>
        <Route path = "/home" element={<HomePage/>}/>

        <Route path = "/signin" element={<SignIn/>}/>
        <Route path = "/signup" element={<SignUp/>}/>

        <Route path = "/problems/createProblem" element={<CreateProblem/>}/>
        <Route path= "/problems/:uniqueId" element={<ProblemPage/>}/>

        <Route path = "/compiler" element={<Compiler/>}/>
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;