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
import ProblemList from './pages/ProblemList';
import ProfilePage from './pages/ProfilePage';
import { useGetProfile } from './Hooks/useGetProfile';
import { useAuthContext } from './Hooks/useAuthContext';
import CodeBattles from './pages/CodeBattles';
import DailyChallenge from './pages/DailyChallenge';

function AppContent() {
  const location = useLocation();
  const { user } = useAuthContext();
  const { getProfile, refetchProfile, error, isLoading, profile } = useGetProfile(user?.username);

  return (
    <div className="App bg-[#18191c] min-h-screen">
      {location.pathname === '/' || location.pathname === '/welcome' ? null : <NavBar userInfo={profile}/>}
      <Routes> 
        <Route path = "*" element={<NotFound/>}/>
        <Route path = "/" element={<WelcomePage userInfo={profile}/>}/>
        <Route path = "/welcome" element={<WelcomePage userInfo={profile}/>}/>
        <Route path = "/home" element={<HomePage userInfo={profile}/>}/>

        <Route path = "/signin" element={<SignIn/>}/>
        <Route path = "/signup" element={<SignUp/>}/>
        <Route path = "/profile/:username" element={<ProfilePage/>}/>

        <Route path = "/problems/createProblem" element={<CreateProblem/>}/>
        <Route path = "/problems/:uniqueId" element={<ProblemPage/>}/>
        <Route path = "/problems/list" element={<ProblemList/>}/>
        <Route path = "/problems/codeBattles" element={<CodeBattles/>}/>
        <Route path = "/problems/dailyChallenge" element={<DailyChallenge userInfo={profile}/>}/>

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