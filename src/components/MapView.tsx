import React, { useContext, useLayoutEffect, useRef } from 'react'
import { MapContext, PlacesContext } from '../context'
import { Loading } from './'
import maplibregl from 'maplibre-gl';

export const MapView = () => {

    const {isLoading, userLocation} = useContext(PlacesContext);
    const {setMap} = useContext(MapContext)
    const mapDiv = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
      if(!isLoading) {
        const map = new maplibregl.Map({
          container: mapDiv.current!, // container id
          style:
              'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL', // stylesheet location
          center: userLocation, // starting position [lng, lat]
          zoom: 11 // starting zoom
      });
  
      map.on('load', () => {
          // data from https://opendata.cityofboise.org/
          map.addSource('off-leash-areas', {
              'type': 'geojson',
              'data':
                  'https://maplibre.org/maplibre-gl-js/docs/assets/boise.geojson'
          });
          map.addLayer({
              'id': 'off-leash-areas',
              'type': 'symbol',
              'source': 'off-leash-areas',
              'layout': {
                  'icon-image': 'dog_park',
                  'text-field': [
                      'format',
                      ['upcase', ['get', 'FacilityName']],
                      {'font-scale': 0.8},
                      '\n',
                      {},
                      ['downcase', ['get', 'Comments']],
                      {'font-scale': 0.6}
                  ],
                  'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                  'text-offset': [0, 0.6],
                  'text-anchor': 'top'
              }
          });
      });    
      setMap(map )
      }
    }, [isLoading])

    if(isLoading) {
        return(<Loading/>)
    }

  return (
    <div ref={mapDiv}
    style={{
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0
    }}
    >
        {userLocation?.join(',')}
    </div>
  )
}


