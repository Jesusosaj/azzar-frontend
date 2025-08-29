import { useState } from "react";
import { NavLink } from "react-router-dom";
import IniciarSesion from "./IniciarSesion";
import CrearCuenta from "./CrearCuenta";

function Navbar() {
  const [modal, setModal] = useState(null); // null, "login", "signup"

  const linkClass = ({ isActive }) =>
    isActive ? "nav-item active" : "nav-item";

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-logo">Azzar</h1>
          <div className="navbar-links">
            <NavLink to="/" className={linkClass}>Inicio</NavLink>
            <NavLink to="/comprar" className={linkClass}>Comprar</NavLink>
          </div>
          <div className="navbar-links">
            <span onClick={() => setModal("signup")} style={{ cursor: 'pointer'}}>Crear cuenta</span>
            <span onClick={() => setModal("login")} style={{ cursor: 'pointer'}}>Iniciar sesion</span>
          </div>
        </div>
      </nav>

      {/* Render de modales */}
      {modal === "login" && <IniciarSesion onClose={() => setModal(null)} />}
      {modal === "signup" && <CrearCuenta onClose={() => setModal(null)} />}
    </>
  );
}

export default Navbar;
