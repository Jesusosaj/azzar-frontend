// CrearCuenta.jsx
function CrearCuenta({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-crear-cuenta">
        <div className="close-container">
          <button className="close-btn" onClick={onClose}>
            x
          </button>
        </div>
        <h2 className="crear-cuenta-title">Crear Cuenta</h2>

        <input
          type="text"
          placeholder="Nombre y Apellido"
          className="input-field"
        />
        <input
          type="text"
          placeholder="Correo electronico"
          className="input-field"
        />
        <input
          type="email"
          placeholder="Contraseña"
          className="input-field"
        />
        <input
          type="password"
          placeholder="Repetir contraseña"
          className="input-field"
        />

        <button className="registrar-btn">Registrar</button>
      </div>
    </div>
  );
}

export default CrearCuenta;
