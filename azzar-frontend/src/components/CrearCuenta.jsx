import './css/CrearCuenta.css'
import closeIcon from '../assets/svg/close.svg'
import { useState } from 'react';

function CrearCuenta({ onClose }) {
  const [countryCode, setCountryCode] = useState("+595");
  const [name, setName] = useState("");         
  const [sexo, setSexo] = useState("F");  
  const [ci, setCi] = useState("");   
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState(""); 
  const [generatedCode, setGeneratedCode] = useState("");
  const [email, setEmail] = useState(""); 

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
      setError("Las contraseñas no coinciden ❌");
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

      console.log(data);
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

const registrarUsuario = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch("http://localhost:8080/v1/sorteo/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombreApellido: name, 
        sexo: sexo,           
        telefono: `${countryCode}${phone.replace(/\s/g, "")}`, // sin espacios
        nroDocumento: ci,   // asigna el valor de input
        correo: email,
        password: password
      })
    });
    console.log(response);
    const data = await response.json();

    if (response.ok) {
      console.log("✅ Usuario registrado:", data);
      onClose(); // cerramos modal
    } else {
      setError(data.error || "Error al registrar usuario ❌");
    }
  } catch (err) {
    console.error(err);
    setError("Error de conexión con el servidor");
  }
};


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
                  placeholder="Nombre y Apellido"
                  className="input-field"
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <label className='label-field' style={{width: '25%'}}>
                <span>Sexo</span>
                <select className='select-field'>
                  <option value="F">Femenino</option>
                  <option value="M">Masculino</option>
                  onChange={(e) => setSexo(e.target.value)}
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
                <span>Nro. Documento</span>
                <input type="text" 
                placeholder='Nro. Documento' 
                onChange={(e) => setCi(e.target.value)}
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
        <h2>Verificar correo</h2>
        <p>Ingresa el código que te enviamos al correo</p>
        <input
          type="text"
          placeholder="Código de 6 dígitos"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        <button
          onClick={() => {
            if (verificationCode === generatedCode.toString()) {
              registrarUsuario();
              setShowVerifyModal(false);
            } else {
              console.log('Error')
            }
          }}
        >
          Verificar
        </button>
        <button onClick={() => setShowVerifyModal(false)}>Cancelar</button>
      </div>
    )}
  </div>
);
}

export default CrearCuenta;
