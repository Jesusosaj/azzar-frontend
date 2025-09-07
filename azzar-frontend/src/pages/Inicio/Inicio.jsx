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
import ps5 from '../../assets/prueba-ps5.png'

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

  const [premios, setPremios] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchPremios = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/premios/listar");
        const data = await res.json();

        const premios = data.map(p => ({
          id_premio: p.id_premio,
          nombre_premio: p.nombre_premio,
          descripcion: p.descripcion,
          fecha_sorteo: p.fecha_sorteo,
          precio_ticket: p.precio_ticket,
          imagen: p.imagen || ps5,
          estado: p.estado,
          fecha_creacion: p.fecha_creacion,
          title: p.nombre_premio
        }));

        setPremios(premios);
      } catch (err) {
        console.error("Error al cargar premios:", err);
      }
    };

    fetchPremios();
  }, []);

  const filteredPremios = premios.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPremios = filteredPremios.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredPremios.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

      <section className='premios-container'>
        <div className='premios-container-header'>
          <h2 className='premios-container-header-h2'>Premios</h2>
          <div className='premios-container-main'>
            <div className='premios-container-main-search'>
              <div className='search-container'>
                <input
                  type="text"
                  placeholder='Buscar premio...'
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>
            </div>
            <div className='premios-container-main-list'>
              <div className='premios-container-main-list-content'>
                {currentPremios.map((item, index) => (
                  <div key={index} className='premios-item'>
                    <div className="premios-img-container">
                      <img src={item.imagen} alt={item.title} />
                    </div>
                    <span className='premios-precio'>Gs {Number(item.precio_ticket).toLocaleString('es-PY')}</span>
                    <span className='premios-title'>{item.title}</span>
                    <span className='premios-descripcion'>
                      {item.descripcion.split(" ").slice(0, 15).join(" ")}{item.descripcion.split(" ").length > 15 ? "..." : ""}
                    </span>
                   <Link to={`/premio/${item.nombre_premio}+${item.id_premio}`} className='premios-btn'>
                      Participar
                    </Link>
                  </div>
                ))}
              </div>
            </div>
            <div className='premios-container-main-paginas'>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={currentPage === i + 1 ? "active" : ""}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Inicio;
