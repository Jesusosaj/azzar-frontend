import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { CarritoProvider } from './context/CarritoContext';
import './index.css';
import './components/css/Navbar.css';
import './pages/InfoPremio/InfoPremio.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CarritoProvider>
      <App />
    </CarritoProvider>
  </StrictMode>
);
