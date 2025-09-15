import { useState, useEffect, useContext } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import closeIcon from '../assets/svg/close.svg';
import IniciarSesion from "./IniciarSesion";
import CrearCuenta from "./CrearCuenta";
import { CartContext } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext"; // <-- Importamos AuthContext
import './css/Navbar.css';

function Navbar() {
  const [modal, setModal] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { cart, isCartOpen, setIsCartOpen, removeTicket } = useContext(CartContext);
  const { isAuthenticated, logout } = useAuth(); // <-- usamos contexto

  // Navegación a inicio
  const Inicio = () => navigate("/");

  // Actualizamos usuario cuando cambie isAuthenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUsuario(decoded);
      } catch {
        localStorage.removeItem("token");
        setUsuario(null);
      }
    } else {
      setUsuario(null);
    }
  }, [isAuthenticated]);

  const cerrarSesion = () => {
    logout(); // <-- usamos logout del contexto
    setUsuario(null);
    setMenuOpen(false);
  };

  const total = cart.reduce((acc, ticket) => acc + Number(ticket.PRECIO || 0), 0);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <h1 className="navbar-logo cursor-pointer" onClick={Inicio}>Azzar</h1>
          <div className="navbar-links">
            {isAuthenticated && usuario ? (
              <>
                {/* Usuario */}
                <span className="item-account" onClick={Inicio}>Inicio</span>
                <div className="usuario-menu-container">
                  <span 
                    className="item-account usuario-trigger"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    {usuario.nombreCompleto || "Usuario"}
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

                {/* Carrito */}
                <span 
                  className="item-account carrito-trigger"
                  onClick={() => setIsCartOpen(!isCartOpen)}
                >
                  <span className="material-symbols-outlined icono">
                    shopping_cart
                  </span>
                  Mi Carrito ({cart.length})
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

      {/* Panel del carrito */}
      {isCartOpen && (
        <div className="cart-panel">
          <div className="cart-header">
            <h3 className="carrito-title">Mi Carrito</h3>
            <div className='close-container-carrito'>
              <button className='close-btn' onClick={() => setIsCartOpen(false)}>
                <img src={closeIcon} />
              </button>
            </div>
          </div>
          <div className="items-carrito-container">
            {cart.length > 0 ? (
              <>
                <ul className="carrito-list-item">
                  {cart.map((ticket) => (
                    <li className="carrito-item" key={ticket.ID_RIFA}>
                      <div className="carrito-item-container">
                        <div className="btn-eliminar-container">
                          <button onClick={() => removeTicket(ticket.ID_RIFA)}>
                            <span className="material-symbols-outlined delete-icon">
                              delete
                            </span>
                          </button>
                        </div>
                        <div className="info-rifa-container">
                          <div className="info-rifa-title-container"><span>{ticket.NOMBRE_PREMIO}</span></div>
                          <div className="info-rifa-descripcion-container">
                            <span>Rifa #{ticket.NOMENCLATURA}</span>
                          </div>
                        </div>
                        <div className="info-rifa-precio-container">
                          <span>{Number(ticket.PRECIO).toLocaleString('es-PY')}Gs</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="btn-continuar-pago-container">
                  <button>
                    <span className="pago-title">Ir a pagar</span>
                    <span className="monto">{total.toLocaleString('es-PY')}Gs</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="carrito-vacio-container">
                <span className="material-symbols-outlined carrito-icon">
                  shopping_cart
                </span>
                <span className="carrito-vacio-text">
                  Tu carrito está vacío
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modales */}
      {modal === "login" && <IniciarSesion onClose={() => setModal(null)} />}
      {modal === "signup" && <CrearCuenta onClose={() => setModal(null)} />}
    </>
  );
}

export default Navbar;
