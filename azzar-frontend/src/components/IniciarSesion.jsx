import googleIcon from '../assets/google-icon.png'

function IniciarSesion({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-iniciar-sesion">
        <div className='close-container'>
          <button className='close-btn' onClick={onClose}>
            x
          </button>
        </div>
        <h2 className='iniciar-sesion-title'>Iniciar sesión</h2>
        <button className='google-btn'>
          <img src={googleIcon} className='google-img' />
          <span className='google-text'>Continuar con google</span>
        </button>
        <button className='email-btn'>
          <span className='email-text'>Continuar con email</span>
        </button>
        <button className='email-btn'>
          <span className='email-text'>No tengo cuenta</span>
        </button>
      </div>
    </div>
  );
}

export default IniciarSesion;
