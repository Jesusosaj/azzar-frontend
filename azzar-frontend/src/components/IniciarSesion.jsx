import './css/IniciarSesion.css'
import closeIcon from '../assets/svg/close.svg'
import { useState } from 'react';

function IniciarSesion({ onClose }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/v1/sorteo/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: correo,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Login exitoso:", data);
        onClose(); // cerramos modal
      } else {
        setError(data.error || "Error al iniciar sesión ❌");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-iniciar-sesion">
        <div className='close-container'>
          <button className='close-btn' onClick={onClose}>
            <img src={closeIcon} />
          </button>
        </div>

        <h2 className='iniciar-sesion-title'>Iniciar sesión</h2>

        <form className='form-container' onSubmit={login}>
          <label className='correo-input-container'>
            <span>Correo electrónico</span>
            <input
              type='email'
              placeholder='Correo electrónico'
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </label>

          <label className='pass-input-container'>
            <span>Contraseña</span>
            <input
              type='password'
              placeholder='Contraseña'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <a className='recovery-pass'>¿Olvidaste tu contraseña?</a>

          {error && <p className="error-message">{error}</p>}

          <button className='submit-btn' type="submit">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default IniciarSesion;
