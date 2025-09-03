import { useParams } from "react-router-dom";
import '../InfoPremio/Premio.css';
import ps5 from '../../assets/prueba-ps5.png'

function Premio() {
  const { nombre } = useParams();

  const tickets = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <div>
        <section className="info-container">
            <div className="info-container-header">
                <div className="info-container-header-img">
                    <img src={ps5} alt="ps5" />
                </div>
                <div className="info-container-header-text">
                    <h3>{nombre}</h3>
                    <p>La consola Sony PlayStation 5 Slim CFI-2000 B30 Versión Digital Slim 1 TB 30th Anniversary Edición Limitada es la combinación perfecta entre innovación, diseño y potencia. Representando tres décadas de excelencia en juegos, esta edición limitada se distingue por su elegante y delgado diseño que encaja cómodamente en cualquier espacio de entretenimiento.</p>
                    <span><b>Precio de rifa:</b> 10.000Gs</span>
                </div>
            </div>
        </section>
        <section className="rifas-container">
            <div className="rifas-container-header">
                <div className="rifas-list">
                    {tickets.map((num) => (
                    <div key={num} className="ticket">
                        <span className="ticket-number">#{num.toString().padStart(3, '0')}</span>
                    </div>
                    ))}
                </div>
            </div>
        </section>
    </div>
  );
}

export default Premio;
