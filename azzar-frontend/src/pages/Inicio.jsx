import background from '../assets/background-main.webp';
import laptop from '../assets/laptop.png';
import iphone from '../assets/iphone.webp';
import ps5 from '../assets/ps5.png';

function Inicio() {
  return (
    <div>
      <section
        className="inicio-container"
        style={{
          backgroundImage: `url(${background})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      >
        <div className="inicio-info flex items-center justify-between w-[80%] mx-auto py-10">
          <div className="flex-1 flex justify-center">
            <img src={laptop} alt="Laptop" className="w-[600px] h-auto" />
          </div>

          <div className="flex-1 text-white space-y-4">
            <p className="inicio-info-p">21 de noviembre</p>
            <h2 className="inicio-info-h2">Sorteos</h2>
            <button className="inicio-info-btn">
              Comprar aquí
            </button>
          </div>
        </div>
      </section>

      {/* Premios Section */}
      <section className="premio-container" id='premio-seccion'>
        <div className="premio-items-container">
          <div className="premio-items">
            <img src={iphone} className="premio-items-img" alt="iPhone 16" />
            <h3>Iphone 16</h3>
            <span className="precio">10.000 Gs</span>
          </div>
          <div className="premio-items">
            <img src={ps5} className="premio-items-img" alt="iPhone 16" />
            <h3>PlayStation 5</h3>
            <span className="precio">15.000 Gs</span>
          </div>
          <div className="premio-items">
            <img src={iphone} className="premio-items-img" alt="iPhone 16" />
            <h3>Iphone 16</h3>
            <span className="precio">10.000 Gs</span>
          </div>
          <div className="premio-items">
            <img src={iphone} className="premio-items-img" alt="iPhone 16" />
            <h3>Iphone 16</h3>
            <span className="precio">10.000 Gs</span>
          </div>
          <div className="premio-items">
            <img src={iphone} className="premio-items-img" alt="iPhone 16" />
            <h3>Iphone 16</h3>
            <span className="precio">10.000 Gs</span>
          </div>
          <div className="premio-items">
            <img src={iphone} className="premio-items-img" alt="iPhone 16" />
            <h3>Iphone 16</h3>
            <span className="precio">10.000 Gs</span>
          </div>
          <div className="premio-items">
            <img src={ps5} className="premio-items-img" alt="iPhone 16" />
            <h3>PlayStation 5</h3>
            <span className="precio">15.000 Gs</span>
          </div>
          <div className="premio-items">
            <img src={iphone} className="premio-items-img" alt="iPhone 16" />
            <h3>Iphone 16</h3>
            <span className="precio">10.000 Gs</span>
          </div>
          <div className="premio-items">
            <img src={iphone} className="premio-items-img" alt="iPhone 16" />
            <h3>Iphone 16</h3>
            <span className="precio">10.000 Gs</span>
          </div>
          <div className="premio-items">
            <img src={iphone} className="premio-items-img" alt="iPhone 16" />
            <h3>Iphone 16</h3>
            <span className="precio">10.000 Gs</span>
          </div>
        </div>
      </section>

        <section className="ganadores-section" id='ganadores-seccion'>
            <div className="ganadores-container">
                <h2 className="ganadores-title">Ganadores</h2>
                <p className="ganadores-empty">Actualmente no hay ganadores</p>
            </div>
        </section>

    </div>
  );
}

export default Inicio;
