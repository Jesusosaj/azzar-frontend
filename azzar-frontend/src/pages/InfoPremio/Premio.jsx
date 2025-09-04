import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import '../InfoPremio/Premio.css';
import ps5 from '../../assets/prueba-ps5.png';

function Premio() {
    const { id } = useParams();
    console.log(id);
    const [premio, setPremio] = useState(null);
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        const fetchPremio = async () => {
            try {
                const response = await fetch(`http://localhost:8080/v1/sorteo/premioById?premio_id=${id}`);
                if (!response.ok) throw new Error("Error al obtener el premio");
                console.log(response);
                const data = await response.json();

                const normalizado = {
                    id: data.id,
                    titulo: data.nombre ?? data.premio ?? "Sin título",
                    descripcion: data.descripcion ?? "",
                    imagenUrl: data.imagen ?? data.img ?? ps5, // fallback a tu imagen local
                    precio: data.precio_ticket ?? data.precio ?? 0,
                };

                setPremio(normalizado);

                const responseTickets = await fetch(`http://localhost:8080/v1/sorteo/tickets?premio_id=${id}`);
                if (!responseTickets.ok) throw new Error("Error al obtener los tickets");
                const dataTickets = await responseTickets.json();

                // 3. Normalizar y guardar los tickets
                const ticketsNormalizados = dataTickets.map(t => ({
                    numero: t.numero,
                    estado: t.estado, // 'disponible', 'vendido', etc.
                    usuarioId: t.usuario_id || null
                }));

                setTickets(ticketsNormalizados);
            } catch (err) {
                console.error(err);
            }
        };

        if (id) {
            fetchPremio();
        }
    }, [id]);

    if (!premio) {
        return <p>Cargando premio...</p>;
    }

    return (
        <div>
            <section className="info-container">
                <div className="info-container-header">
                    <div className="info-container-header-img">
                        <img src={premio.imagenUrl} alt={premio.titulo} />
                    </div>
                    <div className="info-container-header-text">
                        <h3>{premio.titulo}</h3>
                        <p>{premio.descripcion}</p>
                        <span><b>Precio de rifa:</b> {premio.precio} Gs</span>
                    </div>
                </div>
            </section>
            <section className="rifas-container">
                <div className="rifas-container-header">
                    <div className="rifas-list">
                        {tickets.length > 0 ? (
                            tickets.map((ticket) => (
                                <div
                                    key={ticket.numero}
                                    className={`ticket ${ticket.estado === 0 ? 'sold' : 'available'}`}
                                >
                                    <span className="ticket-number">
                                        #{ticket.numero.toString().padStart(3, "0")}
                                    </span>
                                    {ticket.estado === 'vendido' && <span className="sold-badge">Vendido</span>}
                                </div>
                            ))
                        ) : (
                            <p>Cargando tickets...</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Premio;
