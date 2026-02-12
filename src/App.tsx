import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage/LandingPage";  
import Home from "./pages/Home/Home";
import "./App.css";

function App() {

  const  { user, loading } = useAuth();

  if(loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
         <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" />}
        />
          <Route
          path="/login"
          element={!user ? <LandingPage /> : <Navigate to="/" />}
        />
        </Routes>
    </div>
    </Router>
  );
}

export default App;