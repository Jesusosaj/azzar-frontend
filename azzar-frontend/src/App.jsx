import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Inicio from "./pages/Inicio/Inicio.jsx";
import InfoPremio from "./pages/InfoPremio/InfoPremio.jsx";
import Premio from "./pages/Premios/Premio.jsx";
import Pagos from "./pages/Pagos/Pagos.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/:eventoId" element={<Premio />} /> 
          <Route path="/:eventoId/:nombreId" element={<InfoPremio />} /> 
          <Route path="/pagos/checkout" element={<Pagos />} /> 
        </Routes>
      </main>
    </Router>
  )
}

export default App;
