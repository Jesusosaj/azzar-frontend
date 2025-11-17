import './css/IniciarSesion.css';
import closeIcon from '../assets/svg/close.svg';
import { useState } from 'react';

// 🔥 importar hook y el componente
import useNotificacion from "../components/hooks/useNotificacion.js";
import Notificacion from "../components/Notificacion.jsx";

function IniciarSesion({ onClose }) {

  // ------------------ TOAST SYSTEM ------------------
  const { toasts, showToast, removeToast } = useNotificacion();
  // ---------------------------------------------------

  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [newRepeatPassword, setNewRepeatPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewRepeatPassword, setShowNewRepeatPassword] = useState(false);

  const [modalIniciarSesion, setModalIniciarSesion] = useState(true);
  const [modalCargarCorreo, setModalCargarCorreo] = useState(false);
  const [modalVerificarCorreo, setModalVerificarCorreo] = useState(false);
  const [modalCambiarPassword, setModalCambiarPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  // VALIDACIÓN CONTRASEÑA FUERTE
  const validatePassword = (value) => {
    let strength = "Débil";

    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (strongRegex.test(value)) strength = "Fuerte";
    else if (mediumRegex.test(value)) strength = "Media";
    else strength = "Débil";

    setPasswordStrength(strength);
  };

  const cambiarCorreo = (e) =>{
    e.preventDefault();
    setModalCargarCorreo(true);
    setModalVerificarCorreo(false);
  };

  const iniciarSesion = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const usuario = { correo: email, contrasena: password };

      const response = await fetch("http://148.230.72.52:8080/v1/azzar/clientes/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
      });

      const data = await response.text();

      if(response.ok){
        localStorage.setItem("token", data);

        // 🔥 Notificación exitosa
        showToast("Sesión iniciada correctamente", "success");

        onClose();
        window.location.reload();
      }else{
        showToast("Correo o contraseña incorrectos", "error");
      }
    } catch (err) {
      showToast("Error interno, intente más tarde.", "error");
    } finally {
      setLoading(false);
    }
  };

  const enviarCorreo = async (e) =>{
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://148.230.72.52:8080/v1/azzar/clientes/enviar-correo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email })
      });

      const data = await response.text();

      if (response.ok) {
        setGeneratedCode(data);
        setModalCargarCorreo(false);
        setModalVerificarCorreo(true);

        showToast("Código enviado al correo", "info");

      } else {
        showToast("Error al enviar el correo", "error");
      }
    } catch (err) {
      showToast("Error al enviar el correo", "error");
    } finally {
      setLoading(false);
    }
  };

  const olvidastePassword = (e) => {
    e.preventDefault();
    setModalCargarCorreo(true);
    setModalIniciarSesion(false);
  };

  const verificarCodigo = (e) => {
    e.preventDefault();

    if(verificationCode !== generatedCode){
      showToast("El código ingresado es incorrecto", "error");
      return;
    }

    setModalVerificarCorreo(false);
    setModalCambiarPassword(true);
  };

  const cambiarPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      showToast("La contraseña debe tener mínimo 8 caracteres", "error");
      return;
    }

    if (passwordStrength !== "Fuerte") {
      showToast("La contraseña debe ser fuerte (mayúsculas, minúsculas, números y símbolos).", "error");
      return;
    }

    if(newPassword !== newRepeatPassword){
      showToast("Las contraseñas no coinciden", "error");
      return;
    }

    try {
      const usuario = { correo: email, nuevaContrasena: newPassword };

      const response = await fetch("http://148.230.72.52:8080/v1/azzar/clientes/cambiar/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Contraseña cambiada correctamente", "success");
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        showToast("Error al cambiar la contraseña", "error");
      }

    } catch (err) {
      showToast("Error interno, intente más tarde.", "error");
    }
  };

  return (
    <>
      {/* 🔔 NOTIFICACIONES */}
      <Notificacion toasts={toasts} removeToast={removeToast} />

      <div className="modal-overlay">

        {/* ---------------- INICIAR SESIÓN ---------------- */}
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

                <div className="password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder='Contraseña'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <span
                    className="material-symbols-outlined password-eye"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </div>
              </label>

              <a className='recovery-pass' onClick={olvidastePassword}>
                ¿Olvidaste tu contraseña?
              </a>

              {error && <p className="error-message">{error}</p>}

              <button className='submit-btn' type='submit'>
                {loading ? <span className="spinner"></span> : "Iniciar sesión"}
              </button>

            </form>
          </div>
        )}

        {/* ---------------- ENVIAR CORREO ---------------- */}
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
                {loading ? <span className="spinner"></span> : "Enviar código"}
              </button>
            </form>
          </div>
        )}

        {/* ---------------- VERIFICAR CÓDIGO ---------------- */}
        {modalVerificarCorreo && (
          <div className="modal-iniciar-sesion">
            <h2 className='crear-cuenta-title'>Verificar tu correo electrónico</h2>

            <p className='verificar-descripcion'>
              Te enviamos un código de seis dígitos a <b>{email}</b>.
            </p>

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

                    if (val === "") {
                      newCode[index] = "";
                      setVerificationCode(newCode.join(""));

                      if (e.target.previousSibling)
                        e.target.previousSibling.focus();
                      return;
                    }

                    newCode[index] = val;
                    setVerificationCode(newCode.join(""));

                    if (e.target.nextSibling)
                      e.target.nextSibling.focus();
                  }}

                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !verificationCode[index]) {
                      if (e.target.previousSibling)
                        e.target.previousSibling.focus();
                    }
                  }}
                />
              ))}
            </div>

            <span className='change-text'>
              ¿Quieres cambiar tu correo?{" "}
              <a className='change-link' onClick={cambiarCorreo}>Cambiar aquí</a>
            </span>

            {error && <p className="error-message">{error}</p>}

            <button className='btn-verificar' onClick={verificarCodigo}>
              Verificar correo
            </button>

            <a className='btn-reenviar' onClick={enviarCorreo}>
              Reenviar código
            </a>
          </div>
        )}

        {/* ---------------- CAMBIAR CONTRASEÑA ---------------- */}
        {modalCambiarPassword && (
          <div className="modal-iniciar-sesion">
            <div className='close-container'>
              <button className='close-btn' onClick={onClose}>
                <img src={closeIcon} alt="Cerrar"/>
              </button>
            </div>

            <h2 className='iniciar-sesion-title'>Restablecer contraseña</h2>

            <form className='form-container' onSubmit={cambiarPassword}>

              {/* Nueva contraseña */}
              <label className='pass-input-container'>
                <span>Nueva contraseña</span>

                <div className="password-container">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder='Nueva contraseña'
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                    required
                  />

                  <span
                    className="material-symbols-outlined password-eye"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? "visibility_off" : "visibility"}
                  </span>
                </div>

                {newPassword && (
                  <p
                    className={`password-strength ${
                      passwordStrength === "Fuerte"
                        ? "strong"
                        : passwordStrength === "Media"
                        ? "medium"
                        : "weak"
                    }`}
                  >
                    Seguridad: {passwordStrength}
                  </p>
                )}
              </label>

              {/* Repetir contraseña */}
              <label className='pass-input-container'>
                <span>Confirmar contraseña</span>

                <div className="password-container">
                  <input
                    type={showNewRepeatPassword ? "text" : "password"}
                    placeholder='Confirmar contraseña'
                    value={newRepeatPassword}
                    onChange={(e) => setNewRepeatPassword(e.target.value)}
                    required
                  />

                  <span
                    className="material-symbols-outlined password-eye"
                    onClick={() =>
                      setShowNewRepeatPassword(!showNewRepeatPassword)}
                  >
                    {showNewRepeatPassword ? "visibility_off" : "visibility"}
                  </span>
                </div>
              </label>

              {error && <p className="error-message">{error}</p>}

              <button className='submit-btn' type='submit'>
                Cambiar contraseña
              </button>

            </form>
          </div>
        )}

      </div>
    </>
  );
}

export default IniciarSesion;
