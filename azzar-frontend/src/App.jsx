import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Inicio from "./pages/Inicio"
import Comprar from "./pages/Comprar"
import Premios from "./pages/Premios"

function App() {
  return (
    <Router>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/comprar" element={<Comprar />} />
          <Route path="/premios" element={<Premios />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
