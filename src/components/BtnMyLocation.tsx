import React, { useContext } from 'react';
import { GeoAltFill } from 'react-bootstrap-icons';
import { MapContext, PlacesContext } from '../context';

export const BtnMyLocation = () => {

    const {map, isMapReady} = useContext(MapContext)
    const {userLocation} = useContext(PlacesContext)

    const onClick = () => {

        if(!map) throw new Error('Mapa no esta listo')
        if(!userLocation) throw new Error('No hay ubicacion de usuario')

        map?.flyTo({
            zoom: 14,
            center: userLocation
        })
    }

  return (
    <button
      className="btn btn-primary d-flex align-items-center gap-2 shadow rounded-pill px-3 py-2 backdrop-blur"
      onClick={onClick}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 999,
        backdropFilter: 'blur(80px)', // 👈 esto genera el blur
        backgroundColor: 'rgba(0, 68, 255, 0.6)' // color primario con transparencia
      }}
    >
      <GeoAltFill />
      Mi Ubicación
    </button>
  );
};
