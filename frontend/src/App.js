import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import ProtectedRoute from './Components/ProtectedRoute';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import WelcomePage from './pages/WelcomePage';

function App() {
  return (
    <BrowserRouter>
      <div className="App bg-[#18191c] min-h-screen">
        <Routes> 
          <Route path = "*" element={<><NavBar/><NotFound/></>}/>
          <Route path = "/" element={<WelcomePage/>}/>
          <Route path = "/welcome" element={<WelcomePage/>}/>
          <Route path = "/home" element={<><NavBar/><HomePage/></>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
