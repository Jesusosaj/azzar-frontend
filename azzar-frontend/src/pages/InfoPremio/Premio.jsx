import { useParams } from "react-router-dom";
import React, { useEffect, useState, useContext} from "react";
import '../InfoPremio/Premio.css';
import ps5 from '../../assets/prueba-ps5.png'
import { CartContext } from "../../context/CarritoContext.jsx";

function Premio() {
  const { nombreId } = useParams();
  const [nombre, id] = nombreId ? nombreId.split('+') : ["", ""];
  const [premio, setPremio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [hoveredTicket, setHoveredTicket] = useState(null);

  const { cart, toggleTicket, setIsCartOpen } = useContext(CartContext);

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

  const handleTicketClick = (ticket) => {
    if (ticket.ESTADO !== "DISPONIBLE") return;

    const ticketsData = {
      NOMBRE_PREMIO: premio.nombre_premio,
      ID_RIFA: ticket.ID_RIFA,
      NOMENCLATURA: ticket.NOMENCLATURA,
      ESTADO: ticket.ESTADO,
      PRECIO: ticket.PRECIO_RIFA
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
          </div>
          <div className="rifas-list">
            {tickets.map((ticket, index) => {
                ticket.ref = ticket.ref || React.createRef();
                return (
                    <div
                    key={ticket.ID_RIFA}
                    ref={ticket.ref}
                    className={`ticket 
                      ${ticket.ESTADO === "DISPONIBLE" ? "disponible" : "pagado"} 
                      ${isSelected(ticket.ID_RIFA) ? "seleccionado" : ""}
                    `}
                    onClick={() => handleTicketClick(ticket)}
                    onMouseEnter={() => setHoveredTicket(ticket)}
                    onMouseLeave={() => setHoveredTicket(null)}
                    >
                      <span className="ticket-number">
                          {ticket.NOMENCLATURA.charAt(0).toUpperCase()}-{index + 1}
                      </span>

                      {hoveredTicket && hoveredTicket.ID_RIFA === ticket.ID_RIFA && (
                        <div className="ticket-tooltip">
                          <p>Rifa #{ticket.NOMENCLATURA}</p>
                          <p>{ticket.ESTADO}</p>
                          <p>{Number(ticket.PRECIO_RIFA).toLocaleString('es-PY')}Gs</p>
                        </div>
                      )}
                    </div>
                );
            })}
          </div>
        </div>
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
      </section>
    </div>
  );
}

export default Premio;
