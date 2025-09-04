import { Link } from "react-router-dom";
import "../Inicio/Inicio.css";
import consolas from "../../assets/consolas.webp";
import auriculares from "../../assets/auriculares.webp";
import electrodomesticos from "../../assets/electrodomesticos.webp";
import tecnologia from "../../assets/tecnologia.webp";
import maquillajes from "../../assets/maquillajes.webp";
import muebles from "../../assets/muebles.webp";
import merch from "../../assets/merch.webp";
import ps5 from "../../assets/prueba-ps5.png";
import { useEffect, useState } from "react";

function Inicio() {
  const items = [
    { img: consolas, title: "Consolas" },
    { img: maquillajes, title: "Accesorios de belleza" },
    { img: auriculares, title: "Auriculares" },
    { img: merch, title: "Merchandising" },
    { img: electrodomesticos, title: "Electrodomésticos" },
    { img: tecnologia, title: "Tecnologia" },
    { img: muebles, title: "Muebles" },
  ];

  const [premios, setPremios] = useState([]);

  useEffect(() => {
    const fetchPremios = async () => {
      try {
        const response = await fetch("http://localhost:8080/v1/sorteo/premios");
        if (!response.ok) throw new Error("Error al obtener los premios");
        const data = await response.json();

        // Normaliza los campos para el render
        const list = Array.isArray(data) ? data : (data?.data || data?.results || []);
        const normalizados = list.map((p) => ({
          id: p.id,
          titulo: p.nombre ?? p.premio ?? "Sin título",
          descripcion: p.descripcion ?? "",
          imagenUrl: p.imagen ?? p.img ?? "",
          precio: p.precio_ticket ?? p.precio ?? 0,
        }));

        setPremios(normalizados);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPremios();
  }, []);

  return (
    <div>
      <section className="inicio-container">
        <div className="inicio-container-header">
          <div className="inicio-container-header-collage">
            {items.map((item, index) => (
              <div key={index} className={`collage-item size${index + 1}`}>
                <img src={item.img} alt={item.title} className="collage-img" />
                <div className="collage-text">{item.title}</div>
              </div>
            ))}
          </div>
          <div className="inicio-container-header-info">
            <h3 className="inicio-container-header-info-h3">Gana premios</h3>
            <h2 className="inicio-container-header-info-h2">¡Compra tus rifas!</h2>
          </div>
        </div>
      </section>

      <section className="premios-container">
        <div className="premios-container-header">
          <h2 className="premios-container-header-h2">Premios</h2>
          <div className="premios-container-main">
            <div className="premios-container-main-search">
              <div className="search-container">
                <input type="text" placeholder="Buscar premio..." />
              </div>
            </div>

            <div className="premios-container-main-list">
              <div className="premios-container-main-list-content">
                {premios.map((item) => (
                  <div key={item.id ?? item.titulo} className="premios-item">
                    <img src={item.imagen || ps5} alt={item.titulo} />
                    <span className="premios-precio">Gs {item.precio}</span>
                    <span className="premios-title">{item.titulo}</span>
                    <span className="premios-descripcion">{item.descripcion}</span>
                    <Link to={`/premio/${encodeURIComponent(item.id)}`} className="premios-btn">
                      Participar
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="premios-container-main-paginas">
              <button className="active">1</button>
              <button>2</button>
              <button>3</button>
              <button>4</button>
              <button>5</button>
              <button>{">"}</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Inicio;
