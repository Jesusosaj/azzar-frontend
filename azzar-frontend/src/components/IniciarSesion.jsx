import './css/IniciarSesion.css'
import closeIcon from '../assets/svg/close.svg'

function IniciarSesion({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-iniciar-sesion">
        <div className='close-container'>
          <button className='close-btn' onClick={onClose}>
            <img src={closeIcon} />
          </button>
        </div>
        <h2 className='iniciar-sesion-title'>Iniciar sesión</h2>
          <form className='form-container'>
            <label className='correo-input-container'>
              <span>Correo electronico</span>
              <input type='email' placeholder='Correo electronico'/>
            </label>
            <label className='pass-input-container'>
              <span>Contraseña</span>
              <input type='password' placeholder='Contraseña'/>
            </label>
            <a className='recovery-pass'>Olvidaste tu contraseña?</a>
            <button className='submit-btn'>
              Iniciar sesion
            </button>
          </form>
      </div>
    </div>
  );
}

export default IniciarSesion;
