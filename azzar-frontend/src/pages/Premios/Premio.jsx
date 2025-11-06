import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../Premios/Premio.css";
import jwt_decode from "jwt-decode";

function Premio() {
  const { eventoId } = useParams();
  const [evento, id] = eventoId ? eventoId.split('+') : ["", ""];
  const [currentPage, setCurrentPage] = useState(1);
  const [premios, setPremios] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [participarBtn, setParticiparBtn] = useState(false);
  const itemsPerPage = 8;

    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      
        const estaLogueado = async () => {
          const token = localStorage.getItem("token");
          if(token){
            try {
              const decoded = jwt_decode(token);
              if(decoded !== null){
                setParticiparBtn(true);
                return;
              }
    
              setParticiparBtn(false);
              return;
            } catch (err) {
              setParticiparBtn(false);
              return;
            }
          }
        };
    
        const fetchPremios = async () => {
          try {
            const res = await fetch("http://148.230.72.5:8080/v1/azzar/premios/evento/"+id);
            const data = await res.json();

            const premios = data.map(p => ({
              id_evento: id,
              id_premio: p.idPremio,
              nombre_premio: p.nombrePremio,
              descripcion: p.descripcion,
              fecha_sorteo: p.fechaSorteo,
              precio_ticket: p.precioRifa,
              imagen: p.imagen ? `data:image/jpeg;base64,${p.imagen}` : "",
              estado: p.estado,
              fecha_creacion: p.fechaCreacion,
              title: p.nombrePremio
            }));
    
            setPremios(premios);
          } catch (err) {
            console.error("Error al cargar premios:", err);
          }
        };
        
        estaLogueado();
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
                            {participarBtn ? (
                            <Link to={`/${evento}+${id}/${item.nombre_premio}+${item.id_premio}`} className='premios-btn'>
                                Participar
                            </Link>
                            ) : (
                            <Link className='premios-btn blocked'>
                                Participar
                                <span className="material-symbols-outlined">
                                lock
                                </span>
                            </Link>
                            )}
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

export default Premio;