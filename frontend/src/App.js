import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import ProtectedRoute from './Components/ProtectedRoute';
import NavBar from './Components/NavBar';

function App() {
  return (
    <BrowserRouter>
      <div className="App bg-[#18191c] min-h-screen">
        <NavBar/>
        <div>
          <Routes> 
            <Route path = "*" element={<p> NotFound </p>}/>
            <Route path = "/" element={<p> Welcome to InfoBase </p>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
