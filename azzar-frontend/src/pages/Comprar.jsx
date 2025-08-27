import { useState } from "react";

function Comprar() {
  const [carrito, setCarrito] = useState([]);
  const [premioSeleccionado, setPremioSeleccionado] = useState("");
  const precioTicket = 10000;

  const filasTickets = [
    Array.from({ length: 10 }, (_, i) => i + 1),
    Array.from({ length: 9 }, (_, i) => i + 11),
    Array.from({ length: 8 }, (_, i) => i + 20),
    Array.from({ length: 9 }, (_, i) => i + 28),
  ];

  const toggleTicket = (ticket) => {
    if (carrito.includes(ticket)) {
      // Deseleccionar ticket
      setCarrito(carrito.filter((t) => t !== ticket));
    } else {
      // Seleccionar ticket
      setCarrito([...carrito, ticket]);
    }
  };

  const total = carrito.length * precioTicket;

  return (
    <div className="comprar-container">
      {/* Selector de premios */}
      <div className="selector-premio">
        <label htmlFor="premio">Selecciona un premio:</label>
        <select
          id="premio"
          value={premioSeleccionado}
          onChange={(e) => setPremioSeleccionado(e.target.value)}
        >
          <option value="">-- Selecciona --</option>
          <option value="iphone">iPhone</option>
        </select>

        {premioSeleccionado === "iphone" && (
          <div className="tickets-section">
            <h2 className="section-title">IPhone</h2>
            <div className="tickets-grid">
              {filasTickets.map((fila, index) => (
                <div key={index} className="ticket-row">
                  {fila.map((ticket) => (
                    <div
                      key={ticket}
                      className={`ticket-item ${
                        carrito.includes(ticket) ? "selected" : ""
                      }`}
                      onClick={() => toggleTicket(ticket)}
                    >
                      {ticket}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Carrito */}
      <aside className="carrito-section">
        <h2 className="section-title">Carrito</h2>
        {carrito.length === 0 ? (
          <p className="empty-cart">No hay tickets seleccionados</p>
        ) : (
          <ul className="cart-list">
            {carrito.map((ticket, index) => (
              <li key={index} className="cart-item">
                <span>Ticket #{ticket}</span>
                <span>{precioTicket.toLocaleString()} Gs</span>
              </li>
            ))}
          </ul>
        )}
        <div className="carrito-info">
          <div className="cart-total">
            <span>Total:</span>
            <span>{total.toLocaleString()} Gs</span>
          </div>
          <button className="btn-pagar">Ir a pagar</button>
        </div>
      </aside>
    </div>
  );
}

export default Comprar;
