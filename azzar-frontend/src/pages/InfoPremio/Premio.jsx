import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import '../InfoPremio/Premio.css';
import ps5 from '../../assets/prueba-ps5.png'

function Premio() {
  const { nombreId } = useParams();
  const [nombre, id] = nombreId ? nombreId.split('+') : ["", ""];
  const [premio, setPremio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null); // ticket seleccionado para el menú

  // Traer tickets del backend
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/rifas/premio/${id}`);
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error("Error al cargar rifas:", err);
      }
    };
    if (id) fetchTickets();
  }, [id]);

  // Traer datos del premio
  useEffect(() => {
    const fetchPremio = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/premios/${id}`);
        const data = await res.json();
        setPremio({
          id_premio: data.id_premio,
          nombre_premio: data.nombre_premio,
          descripcion: data.descripcion,
          fecha_sorteo: data.fecha_sorteo,
          precio_ticket: data.precio_ticket,
          imagen: data.imagen || ps5,
          estado: data.estado,
          fecha_creacion: data.fecha_creacion,
        });
      } catch (err) {
        console.error("Error al cargar premio:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPremio();
  }, [id]);

  if (loading) return <p>Cargando premio...</p>;
  if (!premio) return <p>No se encontró el premio.</p>;

  // Manejar click en ticket
  const handleTicketClick = (ticket) => {
    if (ticket.ESTADO === "DISPONIBLE") {
      setSelectedTicket(ticket);
    }
  };

  // Función para añadir al carrito
  const addToCart = () => {
    console.log("Añadido al carrito:", selectedTicket);
    // Aquí puedes agregar la lógica para el carrito (localStorage, context, redux, etc.)
    setSelectedTicket(null);
  };

  return (
    <div>
      <section className="info-container">
        <div className="info-container-header">
          <div className="info-container-header-img">
            <img src={premio.imagen} alt={premio.nombre_premio} />
          </div>
          <div className="info-container-header-text">
            <h3>{premio.nombre_premio}</h3>
            <p>{premio.descripcion}</p>
            <span>
              <b>Fecha de Sorteo:</b>{" "}
              {new Date(premio.fecha_sorteo).toLocaleDateString("es-PY", {
                day: "2-digit",
                month: "long",
                year: "numeric"
              })}
            </span>
            <span>
              <b>Horario de Sorteo:</b>{" "}
              {new Date(premio.fecha_sorteo).toLocaleTimeString("es-PY", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
              })} Hs
            </span>
            <span><b>Precio de rifa:</b> {Number(premio.precio_ticket).toLocaleString('es-PY')}Gs</span>
          </div>
        </div>
      </section>

      <section className="rifas-container">
        <div className="rifas-container-header">
          <div className="rifas-list">
            {tickets.map((ticket) => {
                ticket.ref = ticket.ref || React.createRef(); // crear ref si no existe
                return (
                    <div
                    key={ticket.ID_RIFA}
                    ref={ticket.ref}
                    className={`ticket ${ticket.ESTADO === "DISPONIBLE" ? "disponible" : "pagado"}`}
                    onClick={() => handleTicketClick(ticket)}
                    >
                    <span className="ticket-number">
                        #{ticket.NOMENCLATURA.toString().padStart(3, "0")}
                    </span>
                    </div>
                );
            })}

          </div>

          {/* Menú para añadir al carrito */}
            {selectedTicket && (
                <div
                    className="ticket-menu"
                    style={{
                    top: `${selectedTicket.ref.current.offsetTop - 70}px`, // arriba del ticket
                    left: `${selectedTicket.ref.current.offsetLeft + selectedTicket.ref.current.offsetWidth / 2}px`,
                    transform: "translateX(-50%)"
                    }}
                >
                    <p>Rifa #{selectedTicket.NOMENCLATURA}</p>
                    <button onClick={addToCart}>Añadir al carrito</button>
                    <button onClick={() => setSelectedTicket(null)}>Cerrar</button>
                </div>
            )}

        </div>
      </section>
    </div>
  );
}

export default Premio;
