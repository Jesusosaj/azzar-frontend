import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import '../Inicio/Inicio.css'
import consolas from '../../assets/consolas.webp'
import auriculares from '../../assets/auriculares.webp'
import electrodomesticos from '../../assets/electrodomesticos.webp'
import tecnologia from '../../assets/tecnologia.webp'
import maquillajes from '../../assets/maquillajes.webp'
import muebles from '../../assets/muebles.webp'
import merch from '../../assets/merch.webp'

function Inicio() {
  const items = [
    { img: consolas, title: "Consolas" },
    { img: maquillajes, title: "Accesorios de belleza" },
    { img: auriculares, title: "Auriculares" },
    { img: merch, title: "Merchandising" },
    { img: electrodomesticos, title: "Electrodomésticos" },
    { img: tecnologia, title: "Tecnologia" },
    { img: muebles, title: "Muebles" }
  ];

  const [eventos, setEventos] = useState([]);
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const res = await fetch("http://148.230.72.52:8080/v1/azzar/empresas-afiliadas");
        const data = await res.json();
        const ahora = new Date();

        const empresas = data
          .filter(p => new Date(p.fechaHastaAlquiler) >= ahora)
          .map(p => ({
            id_empresa: p.idEmpresa,
            nombre_empresa: p.nombreEmpresa,
            fechaHasta: p.fechaHastaAlquiler
          }));

        setEmpresas(empresas);
      } catch (err) {
        console.error("Error al cargar las empresas:", err);
      }
    };

    const fetchEventos = async () => {
      try {
        const res = await fetch("http://148.230.72.52:8080/v1/azzar/eventos");
        const data = await res.json();

        const eventos = data.map(p => ({
          id_evento: p.idEvento,
          id_empresa: p.idEmpresa,
          nombre_evento: p.nombreEvento,
          ubicacion: p.ubicacionEvento,
          imagen: p.imagenFlyer ? `data:image/jpeg;base64,${p.imagenFlyer}` : "",
          fecha_registro: p.fechaRegistro,
        }));
        setEventos(eventos);
      } catch (err) {
        console.error("Error al cargar eventos:", err);
      }
    };

    fetchEmpresas();
    fetchEventos();
  }, []);

  return (
    <div>
      <section className="inicio-container">
        <div className='inicio-container-header'>
          <div className='inicio-container-header-collage'>
            {items.map((item, index) => (
              <div key={index} className={`collage-item size${index + 1}`}>
                <img src={item.img} alt={item.title} className="collage-img" />
                <div className="collage-text">{item.title}</div>
              </div>
            ))}
          </div>
          <div className='inicio-container-header-info'>
            <h3 className='inicio-container-header-info-h3'>Gana premios</h3>
            <h2 className='inicio-container-header-info-h2'>Compra tus rifas!</h2>
          </div>
        </div>
      </section>

      <section className='eventos-container'>
        <div className='eventos-container-header'>
          <h2 className='eventos-container-header-h2'>Ultimos eventos</h2>
          <div className='eventos-container-main'>
            <div className='eventos-container-main-list'>
              <div className='eventos-container-main-list-content'>
                {eventos.map((item, index) => (
                  <Link to={`/${item.nombre_evento}+${item.id_evento}`} key={index} className="eventos-item">
                   
                      <div className="eventos-img-container">
                        <img src={item.imagen} alt={item.nombre_evento} />
                      </div>
                      <div className="eventos-item-text">
                        <h3 className="eventos-item-title">{item.nombre_evento}</h3>
                        <span className="eventos-item-ubicacion">{item.ubicacion}</span>
                      </div>

                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Inicio;
