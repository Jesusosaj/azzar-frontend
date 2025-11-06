import { useEffect, useState, useRef } from 'react';
import jwt_decode from "jwt-decode";
import './Pagos.css';
import { useNavigate } from "react-router-dom";

function Pagos() {
  const [usuario, setUsuario] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [resumen, setResumen] = useState([]);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && (selected.type === "image/jpeg" || selected.type === "image/png")) {
      setFile(selected);
    } else {
      alert("Solo se permiten imágenes JPG o PNG");
      e.target.value = "";
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUsuario(decoded);
        traerPedidos(decoded.idCliente);
      } catch (err) {
        console.error("Token inválido:", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const traerPedidos = async (idCliente) => {
    try {
      const res = await fetch(`http://148.230.72.52:8080/v1/azzar/pedidos/pendientes/${idCliente}`);
      if (!res.ok) throw new Error("Error al obtener los pedidos");

      const data = await res.json();
      setPedidos(data);
      generarResumen(data);
    } catch (err) {
      console.error("Error al cargar los pedidos:", err);
    }
  };

  const generarResumen = (data) => {
    const resumenMap = {};

    data.forEach(p => {
      if (!resumenMap[p.nombrePremio]) {
        resumenMap[p.nombrePremio] = { cantidad: 0, total: 0, precio: p.precioRifa };
      }
      resumenMap[p.nombrePremio].cantidad += 1;
      resumenMap[p.nombrePremio].total += p.precioRifa;
    });

    const resumenArray = Object.entries(resumenMap).map(([nombrePremio, info]) => ({
      nombrePremio,
      cantidad: info.cantidad,
      total: info.total
    }));

    setResumen(resumenArray);
  };

  const eliminarPedido = async (idRifa) => {
    try {
      const res = await fetch(`http://148.230.72.52:8080/v1/azzar/pagos/eliminar/${idRifa}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error("Error al eliminar el pedido");

      setPedidos(prev => {
        const nuevos = prev.filter(p => p.idRifa !== idRifa);
        generarResumen(nuevos);
        return nuevos;
      });
    } catch (err) {
      console.error("Error al eliminar el pedido:", err);
    }
  };

  const calcularTotal = () => {
    return resumen.reduce((acc, item) => acc + item.total, 0);
  };

  const pagar = async () => {
    if (!file) {
      alert("Por favor, inserte el comprobante de pago antes de continuar.");
      return;
    }

    if (!usuario || !usuario.idCliente) {
      alert("No se pudo identificar el usuario.");
      return;
    }

    if (pedidos.length === 0) {
      alert("No hay pedidos para pagar.");
      return;
    }

    try {
      const idRifas = pedidos.map(p => p.idRifa);
      const formData = new FormData();

      formData.append("idCliente", usuario.idCliente);
      idRifas.forEach(r => formData.append("rifasLista", r));
      formData.append("monto", calcularTotal());
      formData.append("idPagoPar", "null");
      formData.append("referencia", "Pago via web");

      formData.append("imagenComprobante", file);

      const response = await fetch("http://148.230.72.52:8080/v1/azzar/pagos/confirmar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Error al confirmar el pago");

      const data = await response.json();

      if (data === true) {
        alert("Pago confirmado con éxito");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        
        navigate("/");
      } else {
        alert("No se pudo confirmar el pago. Intente nuevamente.");
      }
    } catch (err) {
      console.error("Error al confirmar el pago:", err);
      alert("Error al procesar el pago.");
    }
  };


  return (
    <div className='contenedor'>
      <section className="pedidos-container">
        {/* 🧾 Lista de pedidos */}
        <div className='mis-pedidos'>
          <h3 className='pedidos-title'>Mis pedidos</h3>
          <div className='pedidos-backline'></div>

          {pedidos.length > 0 ? (
            <ul className='pedidos-list'>
              {pedidos.map((p, index) => (
                <li className="pedido-item" key={index}>
                  <div className="pedido-item-container">
                    <div className="btn-eliminar-pedido">
                      <button onClick={() => eliminarPedido(p.idRifa)}>
                        <span className="material-symbols-outlined delete-icon">delete</span>
                      </button>
                    </div>
                    <div className="pedido-info-container">
                      <div className="pedido-info-title">
                        <span>{p.nombrePremio}</span>
                      </div>
                      <div className="pedido-info-descripcion">
                        <span>Rifa #{p.numeroRifa}</span>
                      </div>
                    </div>
                    <div className="pedido-precio-container">
                      <span>{Number(p.precioRifa).toLocaleString('es-PY')} Gs</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className='pedidos-vacio'>
              <span className="material-symbols-outlined pedidos-icon">shopping_cart</span>
              <span className="pedidos-vacio-text">No tienes pedidos pendientes.</span>
            </div>
          )}
        </div>

        {/* 💳 Resumen de pago */}
        {pedidos.length > 0 && (
          <div className='pago-container'>
            <div className='info-cuenta'>
              <img src="https://alarmas.com.py/assets/img/pagos/ueno_bank_2x_1x-removebg-preview.png" alt="ueno bank logo" />
              <span><b>Nro.Cuenta: </b>0023243823-34</span>
              <span><b>Nombre: </b>Azzar</span>
              <span><b>Alias: </b>+595973492323</span>
            </div>
            <h3 className='pago-title'>Items a pagar</h3>
            <div className='pedidos-backline'></div>

            <ul className='items-list'>
              {resumen.map((item, index) => (
                <li className='item-pago' key={index}>
                  <span className='item-pago-nombre'>
                    Rifa {item.nombrePremio} x{item.cantidad}
                  </span>
                  <span className='item-pago-precio'>
                    {Number(item.total).toLocaleString('es-PY')} Gs
                  </span>
                </li>
              ))}
            </ul>

            <div className='pago-total'>
              <span>Total:</span>
              <span className='pago-total-monto'>{Number(calcularTotal()).toLocaleString('es-PY')} Gs</span>
            </div>
            
            <div className="upload-card">
              <label htmlFor="fileInput" className="upload-box">
                <input
                  id="fileInput"
                  type="file"
                  accept=".jpg,.png"
                  onClick={(e) => { e.target.value = null; }}
                  onChange={handleFileChange}
                  className="hidden-input"
                />
                {!file ? (
                  <>
                    <span class="material-symbols-outlined upload-icon">
                      upload
                    </span>
                    <p className="upload-text">Inserte el comprobante de pago</p>
                  </>
                ) : (
                  <div className="file-info">
                    <span className="file-name">{file.name}</span>
                    <button className="remove-btn" onClick={removeFile}>
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                )}
              </label>
            </div>

            <button className='btn-pagar' onClick={pagar}>
              Pagar ahora
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default Pagos;
