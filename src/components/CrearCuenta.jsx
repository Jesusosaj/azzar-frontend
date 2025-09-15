import './css/CrearCuenta.css'
import closeIcon from '../assets/svg/close.svg'
import { useState } from 'react';

function CrearCuenta({ onClose }) {
  const [countryCode, setCountryCode] = useState("+595");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState(""); 
  const [generatedCode, setGeneratedCode] = useState("");

  const [nombre, setNombre] = useState("");
  const [documento, setDocumento] = useState("");
  const [sexo, setSexo] = useState("F");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 9) {
      value = value.slice(0, 9);
    }

    let formatted = value.replace(/(\d{3})(\d{3})(\d{0,3})/, (match, p1, p2, p3) => {
      return [p1, p2, p3].filter(Boolean).join(" ");
    });

    setPhone(formatted);
  };

  const enviarCorreo = async (e) =>{
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

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
        setShowVerifyModal(true);
      } else {
        setError(data.error || "Error al enviar el correo");
      }
    } catch (err) {
      setError("Error al enviar el correo");
    }
  }

  const cambiarCorreo = (e) =>{
    e.preventDefault();
    setShowVerifyModal(false);
  }

  const registrarUsuario = async (e) => {
    e.preventDefault();
    setError("");
    if (verificationCode === generatedCode.toString()) {
      try {
        const usuario = {
          nombreCompleto: nombre,
          nroDocumento: documento,
          sexo: sexo,
          telefono: countryCode + phone.replace(/\s+/g, ""),
          correo: email,
          password: password
        }
        console.log(JSON.stringify(usuario));
        const response = await fetch("http://localhost:8080/v1/sorteo/clientes/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usuario)
        });

        const data = await response.json();

        if(response.ok){
          console.log('Usuario registrado');
          onClose();
        }else{
          setError(data.error || "Error al crear usuario");
        }

      } catch (err) {
        setError("Error Interno, intente mas tarde.");
      }
    } else {
      setError("El código ingresado es incorrecto");
    }
  }

  return (
  <div className="modal-overlay">
    {!showVerifyModal ? (
      <div className="modal-crear-cuenta">
        <div className='close-container'>
          <button className='close-btn' onClick={onClose}>
            <img src={closeIcon} />
          </button>
        </div>

        <h2 className="crear-cuenta-title">Crear cuenta</h2>
        <form className='form-container'>
            <div className='nombre-telefono-container'>
              <label className='label-field' style={{width: '75%'}}>
                <span>Nombre y Apellido</span>
                <input
                  type="text"
                  value={nombre}
                  onChange={ (e) => setNombre(e.target.value)}
                  placeholder="Nombre y Apellido"
                  className="input-field"
                  required
                />
              </label>
              <label className='label-field' style={{width: '25%'}}>
                <span>Sexo</span>
                <select className='select-field'
                value={sexo}
                onChange={ (e) => setSexo(e.target.value)}
                required>
                  <option value="F">Femenino</option>
                  <option value="M">Masculino</option>
                </select>
              </label>
            </div>
            <div className='nombre-telefono-container'>
              <label className='label-field'>
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
                    placeholder="981 123 456"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="telefono-input"
                    required
                  />
                </div>
              </label>
              <label className='label-field'>
                <span>Cedula de Identidad</span>
                <input type="text" 
                value={documento}
                onChange={ (e) => setDocumento(e.target.value)}
                placeholder='Cedula de Identidad' 
                required/>
              </label>
            </div>

            <label className='label-field'>
              <span>Correo electrónico</span>
              <input type="email" 
              placeholder='Correo electrónico' 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required/>
            </label>
            
          <label className='label-field'>
            <span>Contraseña</span>
            <input type="password" 
            placeholder='Contraseña' 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required/>
          </label>
          <label className='label-field'>
            <span>Repetir Contraseña</span>
            <input type="password" 
            placeholder='Repetir Contraseña'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required/>
          </label>

          {error && <p className="error-message">{error}</p>}
          <button className="registrar-btn" onClick={registrarUsuario}>Registrar</button>
        </form>
      </div>
    ) : (
      <div className="modal-crear-cuenta">
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
                if (!val) return;

                let newCode = verificationCode.split("");
                newCode[index] = val;
                const joined = newCode.join("");

                setVerificationCode(joined);

                if (e.target.nextSibling) {
                  e.target.nextSibling.focus();
                }
              }}
            />
          ))}
        </div>
        <span className='change-text'>Quieres cambiar tu direccion de correo electronico? <a className='change-link' onClick={cambiarCorreo}>Cambia aqui!</a></span>
        {error && <p className="error-message">{error}</p>}
        <button className='btn-verificar'
          onClick={registrarUsuario}>
          Verificar correo
        </button>

        <a className='btn-reenviar' onClick={enviarCorreo}>Reenviar código</a>
      </div>

    )}
  </div>
);
}

export default CrearCuenta;
