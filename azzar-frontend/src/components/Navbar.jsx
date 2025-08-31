import { useState } from "react";
import { NavLink } from "react-router-dom";
import IniciarSesion from "./IniciarSesion";
import CrearCuenta from "./CrearCuenta";
import './css/Navbar.css';

function Navbar() {
  const [modal, setModal] = useState(null);

  const linkClass = ({ isActive }) =>
    isActive ? "nav-item active" : "nav-item";

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-logo">Azzar</h1>
          <div className="navbar-links">
            <span onClick={() => setModal("signup")} className="item-account">Crear cuenta</span>
            <span onClick={() => setModal("login")} className="item-account">Iniciar sesion</span>
          </div>
        </div>
      </nav>

      {modal === "login" && <IniciarSesion onClose={() => setModal(null)} />}
      {modal === "signup" && <CrearCuenta onClose={() => setModal(null)} />}
    </>
  );
}

export default Navbar;
