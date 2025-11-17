import { useEffect, useState, useRef } from 'react';
import jwt_decode from "jwt-decode";
import './Pagos.css';
import { useNavigate } from "react-router-dom";
import ImagenTarjeta from "../../assets/tarjetaImagen.webp";

// 🔔 Notificaciones
import useNotificacion from "../../components/hooks/useNotificacion.js";
import Notificacion from "../../components/Notificacion.jsx";

function Pagos() {
  const [usuario, setUsuario] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [resumen, setResumen] = useState([]);
  const [file, setFile] = useState(null);
  const [metodoPago, setMetodoPago] = useState("transferencia");

  // Form tarjeta
  const [nombreTarjeta, setNombreTarjeta] = useState("");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [expiracion, setExpiracion] = useState("");
  const [cvv, setCvv] = useState("");

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Toaster
  const { toasts, showToast, removeToast } = useNotificacion();

  const convertirImagenAFile = async (src, nombreArchivo) => {
    const res = await fetch(src);      // trae la imagen desde /assets
    const blob = await res.blob();     // convierte a Blob
    return new File([blob], nombreArchivo, { type: blob.type });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    if (selected.type === "image/jpeg" || selected.type === "image/png") {
      setFile(selected);
      showToast("Comprobante cargado correctamente", "success");
    } else {
      showToast("Solo se permiten imágenes JPG o PNG.", "error");
      e.target.value = "";
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    showToast("Archivo eliminado", "info");
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
      if (!res.ok) throw new Error();

      if (res.status === 204) {
        setPedidos([]);
        generarResumen([]);
        return;
      }
      
      const data = await res.json();
      setPedidos(data);
      generarResumen(data);

    } catch (err){
      showToast("Error al cargar los pedidos", "error");
    }
  };

  const generarResumen = (data) => {
    const resumenMap = {};

    data.forEach(p => {
      if (!resumenMap[p.nombrePremio]) {
        resumenMap[p.nombrePremio] = { cantidad: 0, total: 0 };
      }
      resumenMap[p.nombrePremio].cantidad++;
      resumenMap[p.nombrePremio].total += p.precioRifa;
    });

    const resumenArr = Object.entries(resumenMap).map(([nombrePremio, info]) => ({
      nombrePremio,
      cantidad: info.cantidad,
      total: info.total
    }));

    setResumen(resumenArr);
  };

  const eliminarPedido = async (idRifa) => {
    try {
      const res = await fetch(`http://148.230.72.52:8080/v1/azzar/pagos/eliminar/${idRifa}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error();

      setPedidos(prev => {
        const nuevos = prev.filter(p => p.idRifa !== idRifa);
        generarResumen(nuevos);
        return nuevos;
      });

      showToast("Ítem eliminado", "success");

    } catch {
      showToast("No se pudo eliminar el ítem", "error");
    }
  };

  const calcularTotal = () =>
    resumen.reduce((acc, item) => acc + item.total, 0);

  // PAGAR TRANSFERENCIA
  const pagarTransferencia = async () => {
    if (!file) return showToast("Inserte el comprobante antes de continuar.", "warning");
    if (!usuario || !usuario.idCliente) return showToast("Usuario no identificado.", "error");
    if (pedidos.length === 0) return showToast("No hay pedidos para pagar.", "warning");

    try {
      const idRifas = pedidos.map(p => p.idRifa);
      const formData = new FormData();

      formData.append("idCliente", usuario.idCliente);
      idRifas.forEach(r => formData.append("rifasLista", r));
      formData.append("monto", calcularTotal());
      formData.append("idPagoPar", "null");
      formData.append("referencia", "Pago via web transferencia");
      formData.append("imagenComprobante", file);

      const response = await fetch("http://148.230.72.52:8080/v1/azzar/pagos/confirmar", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error();

      showToast("Pago realizado con éxito, esperando aprobacion...", "success");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch {
      showToast("Error al procesar el pago", "error");
    }
  };

  // PAGAR TARJETA
  const pagarTarjeta = async () => {
    if (nombreTarjeta.length < 5)
      return showToast("Nombre inválido", "error");

    if (numeroTarjeta.length < 19)
      return showToast("Número de tarjeta inválido", "error");

    if (expiracion.length < 5)
      return showToast("Fecha inválida", "error");

    if (cvv.length < 3)
      return showToast("CVV inválido", "error");

    const idRifas = pedidos.map(p => p.idRifa);
    const formData = new FormData();

    formData.append("idCliente", usuario.idCliente);
    idRifas.forEach(r => formData.append("rifasLista", r));
    formData.append("monto", calcularTotal());
    formData.append("idPagoPar", "null");
    formData.append("referencia", "Pago via web Tarjeta");

    const fileTarjeta = await convertirImagenAFile(ImagenTarjeta, "comprobante_tarjeta.webp");

    formData.append("imagenComprobante", fileTarjeta);

    const response = await fetch("http://148.230.72.52:8080/v1/azzar/pagos/confirmar", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error();

    const res = await fetch(`http://148.230.72.52:8080/v1/azzar/pagos/cliente/${usuario.idCliente}`);
    if (!res.ok) throw new Error();
    const data = await res.json();

    const idPago = data.idPago;

    const aprobacion = await fetch("http://148.230.72.52:8080/v1/azzar/pagos/aprobar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ idPago: idPago })
    });

    if(!aprobacion.ok) throw new Error();

    const envioCorreoComprobante = await fetch(`http://148.230.72.52:8080/v1/azzar/pagos/enviar/${usuario.idCliente}/${idPago}`, {
      method: "POST"
    });

    if(!envioCorreoComprobante.ok) throw new Error();

    showToast("Pago con tarjeta procesado correctamente", "success");

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  // FORMATEO TARJETA
  const formatearTarjeta = (value) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatearFecha = (value) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 4)
      .replace(/(\d{2})(\d{1,2})/, "$1/$2");
  };

  return (
    <>
      <Notificacion toasts={toasts} removeToast={removeToast} />

      <div className='contenedor'>

        <section className="pedidos-container">
          
          {/* LISTA DE PEDIDOS */}
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
                        <span>{p.nombrePremio}</span>
                        <span>Rifa #{p.numeroRifa}</span>
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
                <span>No tienes pedidos pendientes.</span>
              </div>
            )}

          </div>

          {/* MÉTODOS DE PAGO */}
          {pedidos.length > 0 && (
            <div className='pago-container'>

              <div className="metodos-selector">
                <button
                  className={metodoPago === "transferencia" ? "btn-metodo active" : "btn-metodo"}
                  onClick={() => setMetodoPago("transferencia")}
                >
                  Transferencia
                </button>

                <button
                  className={metodoPago === "tarjeta" ? "btn-metodo active" : "btn-metodo"}
                  onClick={() => setMetodoPago("tarjeta")}
                >
                  Tarjeta
                </button>
              </div>

              {/* MODO TRANSFERENCIA */}
              {metodoPago === "transferencia" && (
                <>
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
                        <span>Rifa {item.nombrePremio} x{item.cantidad}</span>
                        <span>{Number(item.total).toLocaleString('es-PY')} Gs</span>
                      </li>
                    ))}
                  </ul>

                  <div className='pago-total'>
                    <span>Total:</span>
                    <span className='pago-total-monto'>{Number(calcularTotal()).toLocaleString('es-PY')} Gs</span>
                  </div>

                  <div className="upload-card">
                    <label className="upload-box">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.png"
                        onChange={handleFileChange}
                        className="hidden-input"
                      />

                      {!file ? (
                        <>
                          <span className="material-symbols-outlined upload-icon">upload</span>
                          <p>Inserte el comprobante de pago</p>
                        </>
                      ) : (
                        <div className="file-info">
                          <span>{file.name}</span>
                          <button className="remove-btn" onClick={removeFile}>
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      )}
                    </label>
                  </div>

                  <button className='btn-pagar' onClick={pagarTransferencia}>
                    Pagar ahora
                  </button>
                </>
              )}

              {/* MODO TARJETA */}
              {metodoPago === "tarjeta" && (
                <div className="tarjeta-form">

                  <h3 className='pago-title'>Pago con tarjeta</h3>
                  <div className='pedidos-backline'></div>

                  <label className="label-tarjeta">
                    Nombre en la tarjeta
                    <input
                      type="text"
                      value={nombreTarjeta}
                      onChange={(e) => setNombreTarjeta(e.target.value)}
                      placeholder="Ej: Juan Pérez"
                    />
                  </label>

                  <label className="label-tarjeta">
                    Número de tarjeta
                    <input
                      type="text"
                      value={numeroTarjeta}
                      onChange={(e) => setNumeroTarjeta(formatearTarjeta(e.target.value))}
                      placeholder="0000 0000 0000 0000"
                      maxLength="19"
                    />
                  </label>

                  <div className="tarjeta-flex">
                    <label className="label-tarjeta">
                      Expiración (MM/YY)
                      <input
                        type="text"
                        value={expiracion}
                        onChange={(e) => setExpiracion(formatearFecha(e.target.value))}
                        placeholder="MM/YY"
                        maxLength="5"
                      />
                    </label>

                    <label className="label-tarjeta">
                      CVV
                      <input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                        placeholder="123"
                        maxLength="3"
                      />
                    </label>
                  </div>

                  <button className="btn-pagar" onClick={pagarTarjeta}>
                    Pagar con tarjeta
                  </button>

                </div>
              )}

            </div>
          )}
        </section>
      </div>
    </>
  );
}

export default Pagos;
