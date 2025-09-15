import { useParams } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import "../InfoPremio/Premio.css";
import ps5 from "../../assets/prueba-ps5.png";
import { CartContext } from "../../context/CarritoContext.jsx";

function Premio() {
  const { nombreId } = useParams();
  const [nombre, id] = nombreId ? nombreId.split("+") : ["", ""];
  const [premio, setPremio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState([]);
  const [hoveredTicket, setHoveredTicket] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const { cart, toggleTicket, setIsCartOpen } = useContext(CartContext);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/v1/sorteo/tickets?premio_id=${id}`
        );
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
        const res = await fetch(
          `http://localhost:8080/v1/sorteo/premioById?premio_id=${id}`
        );
        const data = await res.json();
        setPremio({
          id_premio: data.id_premio,
          nombre_premio: data.nombre,
          descripcion: data.descripcion,
          fecha_sorteo: data.fechaSorteo,
          precio_ticket: data.precio,
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
    if (ticket.estado !== 0) return;

    const ticketsData = {
       NOMBRE_PREMIO: premio.nombre_premio,
    ID_RIFA: ticket.id, // <- usar la propiedad real
    NOMENCLATURA: ticket.numero,
    ESTADO: ticket.estado,
    PRECIO: premio.precio_ticket, 
    };
    console.log("ticket seleccionado: ", ticketsData);
    toggleTicket(ticketsData);
    setIsCartOpen(true);
  };

  const isSelected = (ticketId) => {
   return cart.some((t) => t.ID_RIFA === ticketId);
   console.log("ticketId: ",ticketId, "id: ", id);
  }
  const handleMouseEnter = (ticket, e) => {
    setHoveredTicket(ticket);
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (hoveredTicket) {
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoveredTicket(null);
  };

  return (
    <div onMouseMove={handleMouseMove}>
      {/* Info premio */}
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
                year: "numeric",
              })}
            </span>
            <span>
              <b>Horario de Sorteo:</b>{" "}
              {new Date(premio.fecha_sorteo).toLocaleTimeString("es-PY", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}{" "}
              Hs
            </span>
            <span>
              <b>Precio de rifa:</b>{" "}
              {Number(premio.precio_ticket).toLocaleString("es-PY")}Gs
            </span>
          </div>
        </div>
      </section>

      {/* Rifas */}
      <section className="rifas-container">
        <div className="rifas-container-header">
          <div className="title-rifas-container">
            <h3 className="title-rifas">Listado de Rifas</h3>
          </div>
          <div className="rifas-list">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`ticket 
                  ${ticket.estado === 0 ? "disponible" : "pagado"} 
                  ${isSelected(ticket.id) ? "seleccionado" : ""}
                `}
                onClick={() => handleTicketClick(ticket)}
                onMouseEnter={(e) => handleMouseEnter(ticket, e)}
                onMouseLeave={handleMouseLeave}
              >
                <span className="ticket-number">
                  #{String(ticket.numero).padStart(3, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leyenda */}
        <div className="estados-rifas-container">
          <ul className="estados-rifas-list">
            <div className="estados-item">
              <div
                className="estados-color"
                style={{
                  background: "#fff",
                  height: "20px",
                  width: "20px",
                }}
              ></div>
              <span className="estados-text">Disponible</span>
            </div>
            <div className="estados-item">
              <div
                className="estados-color"
                style={{
                  background: "#ae2f2f",
                  height: "20px",
                  width: "20px",
                }}
              ></div>
              <span className="estados-text">Pagado</span>
            </div>
            <div className="estados-item">
              <div
                className="estados-color"
                style={{
                  background: "#202020",
                  height: "20px",
                  width: "20px",
                }}
              ></div>
              <span className="estados-text">Seleccionado</span>
            </div>
          </ul>
        </div>
      </section>

      {/* Tooltip flotante */}
      {hoveredTicket && (
        <div
          className="ticket-tooltip"
          style={{
            position: "fixed",
            top: tooltipPos.y + 15,
            left: tooltipPos.x + 15,
            background: "#fff",
            border: "1px solid #ccc",
            padding: "8px",
            borderRadius: "4px",
            pointerEvents: "none",
            zIndex: 1000,
          }}
        >
          <p>Rifa #{hoveredTicket.numero}</p>
          <p>
            {hoveredTicket.estado === 0 ? "Disponible" : "Pagado"}
          </p>
          <p>
            {Number(hoveredTicket.PRECIO_RIFA).toLocaleString("es-PY")}Gs
          </p>
        </div>
      )}
    </div>
  );
}

export default Premio;