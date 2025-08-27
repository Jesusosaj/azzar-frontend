import { NavLink } from "react-router-dom"

function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "nav-item active"
      : "nav-item"

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo">Azzar</h1>
        <div className="navbar-links">
          <NavLink to="/" className={linkClass}>Inicio</NavLink>
          <NavLink to="/comprar" className={linkClass}>Comprar</NavLink>
        </div>
        <div className="navbar-links">
          <span>Crear cuenta</span>
          <span>Iniciar sesion</span>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
