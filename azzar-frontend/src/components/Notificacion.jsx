import { useEffect } from "react";
import "./css/Notificacion.css";

function Notificacion({ toasts, removeToast }) {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div 
          key={toast.id} 
          className={`toast toast-${toast.type}`}
        >
          <span>{toast.message}</span>

          <button className="toast-close" onClick={() => removeToast(toast.id)}>
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default Notificacion;
