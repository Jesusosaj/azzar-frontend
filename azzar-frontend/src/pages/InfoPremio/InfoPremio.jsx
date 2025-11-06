import { useParams } from "react-router-dom";
import React, { useEffect, useState, useContext} from "react";
import '../InfoPremio/InfoPremio.css';
import { CartContext } from "../../context/CarritoContext.jsx";

function InfoPremio() {
  const { nombreId } = useParams();
  const [nombre, id] = nombreId ? nombreId.split('+') : ["", ""];
  const [premio, setPremio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [hoveredTicket, setHoveredTicket] = useState(null);

  const { cart, toggleTicket, setIsCartOpen } = useContext(CartContext);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    const fetchTickets = async () => {
      try {
        const res = await fetch(`https://unlyrical-bronwyn-subangular.ngrok-free.dev/v1/azzar/rifas/premio/${id}`);
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error("Error al cargar rifas:", err);
      }
    };
    if (id) fetchTickets();
  }, [id]);

  useEffect(() => {
    const fetchPremio = async () => {
      try {
        const res = await fetch(`https://unlyrical-bronwyn-subangular.ngrok-free.dev/v1/azzar/premios/${id}`);
        const data = await res.json();
        setPremio({
          id_premio: data.idPremio,
          id_evento: data.idEvento,
          nombre_premio: data.nombrePremio,
          descripcion: data.descripcion,
          fecha_sorteo: data.fechaSorteo,
          precio_ticket: data.precioRifa,
          imagen: data.imagen ? `data:image/jpeg;base64,${data.imagen}` : "",
          estado: data.estado,
          fecha_creacion: data.fechaCreacion,
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

  const handleTicketClick = (ticket) => {
    if (ticket.estadoRifa !== 1) return;

    const ticketsData = {
      NOMBRE_PREMIO: premio.nombre_premio,
      ID_RIFA: ticket.idRifa,
      NOMENCLATURA: ticket.numeroRifa,
      ESTADO: ticket.estadoRifa,
      PRECIO: premio.precio_ticket
    };

    toggleTicket(ticketsData);
    setIsCartOpen(true);
  };

  const isSelected = (ticketId) => cart.some((t) => t.ID_RIFA === ticketId);

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
          <div className="title-rifas-container">
            <h3 className="title-rifas">Listado de Rifas</h3>
            <div className="estados-rifas-container">
              <ul className="estados-rifas-list">
                <div className="estados-item">
                  <div className="estados-color" style={{background: '#fff', height: '20px', width: '20px'}}></div>
                  <span className="estados-text">Disponible</span>
                </div>
                <div className="estados-item">
                  <div className="estados-color" style={{background: '#ae2f2f', height: '20px', width: '20px'}}></div>
                  <span className="estados-text">Pagado</span>
                </div>
                <div className="estados-item">
                  <div className="estados-color" style={{background: '#202020', height: '20px', width: '20px'}}></div>
                  <span className="estados-text">Seleccionado</span>
                </div>
              </ul>
            </div>
          </div>
          <div className="rifas-list">
            {tickets.map((ticket, index) => {
                ticket.ref = ticket.ref || React.createRef();
                return (
                    <div
                    key={ticket.idRifa}
                    ref={ticket.ref}
                    className={`ticket 
                      ${ticket.estadoRifa === 1 ? "disponible" : "pagado"} 
                      ${isSelected(ticket.idRifa) ? "seleccionado" : ""}
                    `}
                    onClick={() => handleTicketClick(ticket)}
                    onMouseEnter={() => setHoveredTicket(ticket)}
                    onMouseLeave={() => setHoveredTicket(null)}
                    >
                      <span className="ticket-number">
                          {ticket.numeroRifa.charAt(0).toUpperCase()}-{index + 1}
                      </span>

                      {hoveredTicket && hoveredTicket.idRifa === ticket.idRifa && (
                        <div className="ticket-tooltip">
                          <p>Rifa #{ticket.numeroRifa}</p>
                          <p>{ticket.estadoRifa === 1 ? "DISPONIBLE" : ticket.estadoRifa === 2 ? "PAGADO" : ticket.estadoRifa === 3 ? "RESERVA" : ""}</p>
                          <p>{Number(premio.precio_ticket).toLocaleString('es-PY')}Gs</p>
                        </div>
                      )}
                    </div>
                );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

export default InfoPremio;