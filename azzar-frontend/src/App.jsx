import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Inicio from "./pages/Inicio/Inicio.jsx";
import Premio from "./pages/InfoPremio/Premio.jsx";
import { AuthProvider } from "./context/AuthContext"; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/premio/:id" element={<Premio />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  )
}

export default App;
