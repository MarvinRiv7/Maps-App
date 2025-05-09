import React from 'react';
import ReactDOM from 'react-dom/client';
import { MapsApp } from './MapsApp';


if(!navigator.geolocation) {
  alert('Tu navegador no tiene opcion de Geolocalizacion')
  throw new Error('Tu navegador no tiene opcion de Geolocalizacion')
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MapsApp/>
  </React.StrictMode>
);
