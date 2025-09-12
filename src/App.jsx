import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Inicio from "./pages/Inicio/Inicio.jsx";
import Premio from "./pages/InfoPremio/Premio.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/premio/:nombreId" element={<Premio />} /> 
        </Routes>
      </main>
    </Router>
  )
}

export default App;
