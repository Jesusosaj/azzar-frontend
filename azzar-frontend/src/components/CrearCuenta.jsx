import "./css/CrearCuenta.css";
import closeIcon from "../assets/svg/close.svg";
import { useState } from "react";

// 🔥 Importar notificaciones
import useNotificacion from "../components/hooks/useNotificacion.js";
import Notificacion from "../components/Notificacion.jsx";

function CrearCuenta({ onClose }) {

  // TOAST SYSTEM
  const { toasts, showToast, removeToast } = useNotificacion();

  const [countryCode, setCountryCode] = useState("+595");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [sexo, setSexo] = useState("F");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 9) value = value.slice(0, 9);

    let formatted = value.replace(
      /(\d{3})(\d{3})(\d{0,3})/,
      (match, p1, p2, p3) => [p1, p2, p3].filter(Boolean).join(" ")
    );

    setPhone(formatted);
  };

  // Validación de contraseña
  const validatePassword = (value) => {
    let strength = "Débil";

    const strongRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    const mediumRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (strongRegex.test(value)) strength = "Fuerte";
    else if (mediumRegex.test(value)) strength = "Media";

    setPasswordStrength(strength);
  };

  const enviarCorreo = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      !nombre || !documento || !sexo || !email ||
      !phone || !password || !confirmPassword
    ) {
      showToast("Todos los campos son obligatorios", "error");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      showToast("La contraseña debe tener al menos 8 caracteres", "error");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      showToast("Las contraseñas no coinciden", "error");
      setLoading(false);
      return;
    }

    if (passwordStrength !== "Fuerte") {
      showToast(
        "La contraseña debe ser fuerte (mayús., minús., número y símbolo).",
        "error"
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://148.230.72.52:8080/v1/azzar/clientes/enviar-correo",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo: email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showToast("Código enviado a tu correo", "info");
        setGeneratedCode(data);
        setShowVerifyModal(true);
      } else {
        showToast(data.error || "Error al enviar el correo", "error");
      }

    } catch (err) {
      showToast("Error al enviar el correo", "error");
    } finally {
      setLoading(false);
    }
  };

  const cambiarCorreo = (e) => {
    e.preventDefault();
    setShowVerifyModal(false);
  };

  const registrarUsuario = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (verificationCode !== generatedCode.toString()) {
      showToast("El código ingresado es incorrecto", "error");
      setLoading(false);
      return;
    }

    try {
      const usuario = {
        nombreCliente: nombre,
        nroDocumento: documento,
        sexo: sexo,
        telefono: countryCode + phone.replace(/\s+/g, ""),
        correo: email,
        contrasena: password,
        estado: 1,
      };

      const response = await fetch(
        "http://148.230.72.52:8080/v1/azzar/clientes/registrar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usuario),
        }
      );

      const data = await response.json();

      if (response.ok) {
        showToast("Cuenta creada correctamente", "success");

        // Espera 1 segundo para mostrar toast
        setTimeout(() => {
          onClose();
        }, 1000);

      } else {
        showToast(data.error || "Error al crear usuario", "error");
      }

    } catch (err) {
      showToast("Error interno, intente más tarde.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔔 Notificaciones */}
      <Notificacion toasts={toasts} removeToast={removeToast} />

      <div className="modal-overlay">

        {!showVerifyModal ? (
          /**************** FORMULARIO PRINCIPAL ****************/
          <div className="modal-crear-cuenta">
            <div className="close-container">
              <button className="close-btn" onClick={onClose}>
                <img src={closeIcon} alt="cerrar" />
              </button>
            </div>

            <h2 className="crear-cuenta-title">Crear cuenta</h2>

            <form className="form-container">

              {/* Nombre + Sexo */}
              <div className="nombre-telefono-container">
                <label className="label-field" style={{ width: "75%" }}>
                  <span>Nombre y Apellido</span>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre y Apellido"
                    required
                  />
                </label>

                <label className="label-field" style={{ width: "25%" }}>
                  <span>Sexo</span>
                  <select
                    className="select-field"
                    value={sexo}
                    onChange={(e) => setSexo(e.target.value)}
                    required
                  >
                    <option value="F">Femenino</option>
                    <option value="M">Masculino</option>
                  </select>
                </label>
              </div>

              {/* Teléfono + Documento */}
              <div className="nombre-telefono-container">
                <label className="label-field">
                  <span>Teléfono</span>
                  <div className="telefono-container">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="telefono-select"
                    >
                      <option value="+595">🇵🇾 +595</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Telefono"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="telefono-input"
                      required
                    />
                  </div>
                </label>

                <label className="label-field">
                  <span>Cédula de Identidad</span>
                  <input
                    type="text"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                    placeholder="Cédula de Identidad"
                    required
                  />
                </label>
              </div>

              {/* Email */}
              <label className="label-field">
                <span>Correo electrónico</span>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              {/* Contraseña */}
              <label className="label-field">
                <span>Contraseña</span>
                <div className="password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      validatePassword(e.target.value);
                    }}
                    required
                  />

                  <span
                    className="material-symbols-outlined password-eye"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </div>

                {password && (
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

              {/* Confirmar contraseña */}
              <label className="label-field">
                <span>Repetir Contraseña</span>
                <div className="repeat-password-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Repetir Contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

              <button className="registrar-btn" onClick={enviarCorreo}>
                {loading ? <span className="spinner"></span> : "Registrar"}
              </button>
            </form>

          </div>

        ) : (
          /**************** MODAL DE VERIFICACIÓN ****************/
          <div className="modal-crear-cuenta">

            <h2 className="crear-cuenta-title">Verificar tu correo</h2>

            <p className="verificar-descripcion">
              Te enviamos un código de seis dígitos a{" "}
              <b style={{ color: "#202020" }}>{email}</b>.
            </p>

            <div className="inputs-container">
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
                />
              ))}
            </div>

            <span className="change-text">
              ¿Quieres cambiar tu correo?{" "}
              <a className="change-link" onClick={cambiarCorreo}>
                Cambiar aquí
              </a>
            </span>

            <button className="btn-verificar" onClick={registrarUsuario}>
              {loading ? <span className="spinner"></span> : "Verificar correo"}
            </button>

            <a className="btn-reenviar" onClick={enviarCorreo}>
              Reenviar código
            </a>

          </div>
        )}
      </div>
    </>
  );
}

export default CrearCuenta;
