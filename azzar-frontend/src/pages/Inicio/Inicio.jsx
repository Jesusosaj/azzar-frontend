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
                <input type="text" placeholder='Buscar premio...' />
              </div>
            </div>
            <div className='premios-container-main-list'>
              <div className='premios-container-main-list-content'>
                <div className='premios-item'>
                  <img src={ps5} alt='ps5'/>
                  <span className='premios-precio'>Gs 10.000</span>
                  <span className='premios-title'>Playstation 5</span>
                  <span className='premios-descripcion'>La PS5 incorpora soporte para salida de 120 Hz en pantallas 4K, permitiéndote...</span>
                  <button className='premios-btn'>
                    Participar
                  </button>
                </div>
                <div className='premios-item'>
                  <img src={ps5} alt='ps5'/>
                  <span className='premios-precio'>Gs 10.000</span>
                  <span className='premios-title'>Playstation 5</span>
                  <span className='premios-descripcion'>La PS5 incorpora soporte para salida de 120 Hz en pantallas 4K, permitiéndote...</span>
                  <button className='premios-btn'>
                    Participar
                  </button>
                </div>
                <div className='premios-item'>
                  <img src={ps5} alt='ps5'/>
                  <span className='premios-precio'>Gs 10.000</span>
                  <span className='premios-title'>Playstation 5</span>
                  <span className='premios-descripcion'>La PS5 incorpora soporte para salida de 120 Hz en pantallas 4K, permitiéndote...</span>
                  <button className='premios-btn'>
                    Participar
                  </button>
                </div>
                <div className='premios-item'>
                  <img src={ps5} alt='ps5'/>
                  <span className='premios-precio'>Gs 10.000</span>
                  <span className='premios-title'>Playstation 5</span>
                  <span className='premios-descripcion'>La PS5 incorpora soporte para salida de 120 Hz en pantallas 4K, permitiéndote...</span>
                  <button className='premios-btn'>
                    Participar
                  </button>
                </div>
                <div className='premios-item'>
                  <img src={ps5} alt='ps5'/>
                  <span className='premios-precio'>Gs 10.000</span>
                  <span className='premios-title'>Playstation 5</span>
                  <span className='premios-descripcion'>La PS5 incorpora soporte para salida de 120 Hz en pantallas 4K, permitiéndote...</span>
                  <button className='premios-btn'>
                    Participar
                  </button>
                </div>
                <div className='premios-item'>
                  <img src={ps5} alt='ps5'/>
                  <span className='premios-precio'>Gs 10.000</span>
                  <span className='premios-title'>Playstation 5</span>
                  <span className='premios-descripcion'>La PS5 incorpora soporte para salida de 120 Hz en pantallas 4K, permitiéndote...</span>
                  <button className='premios-btn'>
                    Participar
                  </button>
                </div>
                <div className='premios-item'>
                  <img src={ps5} alt='ps5'/>
                  <span className='premios-precio'>Gs 10.000</span>
                  <span className='premios-title'>Playstation 5</span>
                  <span className='premios-descripcion'>La PS5 incorpora soporte para salida de 120 Hz en pantallas 4K, permitiéndote...</span>
                  <button className='premios-btn'>
                    Participar
                  </button>
                </div>
                <div className='premios-item'>
                  <img src={ps5} alt='ps5'/>
                  <span className='premios-precio'>Gs 10.000</span>
                  <span className='premios-title'>Playstation 5</span>
                  <span className='premios-descripcion'>La PS5 incorpora soporte para salida de 120 Hz en pantallas 4K, permitiéndote...</span>
                  <button className='premios-btn'>
                    Participar
                  </button>
                </div>
              </div>
            </div>
            <div className='premios-container-main-paginas'>
              <button className="active">1</button>
              <button>2</button>
              <button>3</button>
              <button>4</button>
              <button>5</button>
              <button>{'>'}</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Inicio;
