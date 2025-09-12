import './css/IniciarSesion.css';
import closeIcon from '../assets/svg/close.svg';
import { useState } from 'react';
import { useAuth } from "../context/AuthContext"; 

function IniciarSesion({ onClose }) {
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [newRepeatPassword, setNewRepeatPassword] = useState("");

  const [modalIniciarSesion, setModalIniciarSesion] = useState(true);
  const [modalCargarCorreo, setModalCargarCorreo] = useState(false);
  const [modalVerificarCorreo, setModalVerificarCorreo] = useState(false);
  const [modalCambiarPassword, setModalCambiarPassword] = useState(false);

  const cambiarCorreo = (e) =>{
    e.preventDefault();
    setModalCargarCorreo(true);
    setModalVerificarCorreo(false);
  }

  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      const usuario = { correo: email, password: password };

      const response = await fetch("http://localhost:8080/v1/sorteo/clientes/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
      });

      const data = await response.json();

      if(response.ok){
        localStorage.setItem("token", data.body.token);
        login(data.body.token); 
        onClose();
      }else{
        setError(data.error || "Error al iniciar sesión");  
      }
    } catch (err) {
      setError("Error interno, intente más tarde.");
    }
  }

  const enviarCorreo = async (e) =>{
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/verificacion/enviar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email })
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedCode(data.codigo);
        setModalCargarCorreo(false);
        setModalVerificarCorreo(true);
      } else {
        setError(data.error || "Error al enviar el correo");
      }
    } catch (err) {
      setError("Error al enviar el correo");
    }
  }

  const olvidastePassword = (e) => {
    e.preventDefault();
    setModalCargarCorreo(true);
    setModalIniciarSesion(false);
  }

  const verificarCodigo = (e) => {
    e.preventDefault();

    console.log(verificationCode);

    console.log(generatedCode);
    if(verificationCode !== generatedCode){
      console.log("codigos erroneos");
    }

    setModalVerificarCorreo(false);
    setModalCambiarPassword(true);
  }

  const cambiarPassword = async (e) => {
    e.preventDefault();

    if(newPassword !== newRepeatPassword){
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const usuario = { correo: email, password: newPassword };

      const response = await fetch("http://localhost:3000/api/clientes/cambiar/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
      });

      const data = await response.json();

      if (response.ok) {
        onClose();
      } else {
        setError(data.error || "Error al cambiar la contraseña");
      }

    } catch (err) {
      setError("Error interno, intente más tarde.");
    }
  }

  return (
    <div className="modal-overlay">
      {/* Iniciar Sesion */}
      {modalIniciarSesion && (
        <div className="modal-iniciar-sesion">
          <div className='close-container'>
            <button className='close-btn' onClick={onClose}>
              <img src={closeIcon} alt="Cerrar"/>
            </button>
          </div>
          <h2 className='iniciar-sesion-title'>Iniciar sesión</h2>
          <form className='form-container' onSubmit={iniciarSesion}>
            <label className='correo-input-container'>
              <span>Correo electrónico</span>
              <input
                type='email' 
                placeholder='Correo electrónico'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <a 
              className='recovery-pass' 
              onClick={olvidastePassword}
            >
              Olvidaste tu contraseña?
            </a>
            {error && <p className="error-message">{error}</p>}
            <button className='submit-btn' type='submit'>
              Iniciar sesión
            </button>
          </form>
        </div>
      )}

      {/* Cargar correo */}
      {modalCargarCorreo && (
        <div className="modal-iniciar-sesion">
          <div className='close-container'>
            <button className='close-btn' onClick={onClose}>
              <img src={closeIcon} alt="Cerrar"/>
            </button>
          </div>
          <h2 className='iniciar-sesion-title'>Verificar correo</h2>
          <form className='form-container' onSubmit={enviarCorreo}>
            <label className='correo-input-container'>
              <span>Correo electrónico</span>
              <input
                type='email' 
                placeholder='Correo electrónico'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <button className='submit-btn' type='submit'>
              Enviar código
            </button>
          </form>
        </div>
      )}

      {/* Verificar correo */}
      {modalVerificarCorreo && (
        <div className="modal-iniciar-sesion">
          <h2 className='crear-cuenta-title'>Verificar tu correo electrónico</h2>
          <p className='verificar-descripcion'>Te enviamos un código de seis dígitos a <b style={{color: '#202020'}}>{email}</b>. Ingresa el código a continuación para confirmar tu dirección de correo electrónico.</p>
          <div className='inputs-container'>
            {Array.from({ length: 6 }).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                inputMode="numeric"
                style={{
                  width: "40px",
                  height: "40px",
                  textAlign: "center",
                  fontSize: "18px",
                }}
                value={verificationCode[index] || ""}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  let newCode = verificationCode.split("");

                  newCode[index] = val || "";
                  const joined = newCode.join("");
                  setVerificationCode(joined);

                  if (val && e.target.nextSibling) {
                    e.target.nextSibling.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !verificationCode[index] && e.target.previousSibling) {
                    e.target.previousSibling.focus();
                  }
                }}

              />
            ))}
          </div>
          <span className='change-text'>Quieres cambiar tu direccion de correo electronico? <a className='change-link' onClick={cambiarCorreo}>Cambia aqui!</a></span>
          {error && <p className="error-message">{error}</p>}
          <button className='btn-verificar'
            onClick={verificarCodigo}>
            Verificar correo
          </button>

          <a className='btn-reenviar' onClick={enviarCorreo}>Reenviar código</a>
        </div>
      )}

      {/* Cambiar contraseña */}
      {modalCambiarPassword && (
        <div className="modal-iniciar-sesion">
          <div className='close-container'>
            <button className='close-btn' onClick={onClose}>
              <img src={closeIcon} alt="Cerrar"/>
            </button>
          </div>
          <h2 className='iniciar-sesion-title'>Restablecer contraseña</h2>
          <form className='form-container' onSubmit={cambiarPassword}>
            <label className='pass-input-container'>
              <span>Nueva contraseña</span>
              <input
                type='password' 
                placeholder='Nueva contraseña'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </label>
            <label className='pass-input-container'>
              <span>Confirmar contraseña</span>
              <input
                type='password' 
                placeholder='Confirmar contraseña'
                value={newRepeatPassword}
                onChange={(e) => setNewRepeatPassword(e.target.value)}
                required
              />
            </label>
            {error && <p className="error-message">{error}</p>}
            <button className='submit-btn' type='submit'>
              Cambiar contraseña
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default IniciarSesion;