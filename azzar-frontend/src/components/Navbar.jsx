import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import IniciarSesion from "./IniciarSesion";
import CrearCuenta from "./CrearCuenta";
import './css/Navbar.css';

function Navbar() {
  const [modal, setModal] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const Inicio = () => {
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUsuario(decoded);
      } catch (err) {
        console.error("Token inválido");
        localStorage.removeItem("token");
      }
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setUsuario(null);
    window.location.reload();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-logo cursor-pointer" onClick={Inicio}>Azzar</h1>
          <div className="navbar-links">
            {usuario ? (
              <>
                <div className="usuario-menu-container">
                  <span 
                    className="item-account usuario-trigger"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    {usuario.nombreCompleto}
                    <span className="material-symbols-outlined icono">
                      arrow_drop_down
                    </span>
                  </span>
                  {menuOpen && (
                    <div className="usuario-dropdown">
                      <span onClick={cerrarSesion} className="dropdown-item">
                        Cerrar sesión
                      </span>
                    </div>
                  )}
                </div>

                <span className="item-account">
                  <span className="material-symbols-outlined icono">
                    shopping_cart
                  </span>
                  Mi Carrito
                </span>
              </>
            ) : (
              <>
                <span onClick={() => setModal("signup")} className="item-account">Crear cuenta</span>
                <span onClick={() => setModal("login")} className="item-account">Iniciar sesión</span>
              </>
            )}
          </div>
        </div>
      </nav>

      {modal === "login" && <IniciarSesion onClose={() => setModal(null)} />}
      {modal === "signup" && <CrearCuenta onClose={() => setModal(null)} />}
    </>
  );
}

export default Navbar;