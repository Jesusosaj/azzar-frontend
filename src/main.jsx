import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { CarritoProvider } from './context/CarritoContext';
import { AuthProvider } from './context/AuthContext'; // <-- importar AuthProvider
import './index.css';
import './components/css/Navbar.css';
import './pages/InfoPremio/Premio.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>       
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </AuthProvider>
  </StrictMode>
);
