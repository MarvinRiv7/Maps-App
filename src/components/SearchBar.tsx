import React, { ChangeEvent, useRef, useState, useContext } from "react";
import { MapContext } from "../context/map/MapContext";
import { Marker, Popup } from "maplibre-gl";

export const SearchBar = () => {
  const { map } = useContext(MapContext);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [places, setPlaces] = useState<any[]>([]);
  const [marker, setMarker] = useState<Marker | null>(null);

  const onQueryChanged = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchPlaces(query);
    }, 1000);
  };

  const searchPlaces = async (query: string) => {
    if (query.length === 0) {
      setPlaces([]);
      return;
    }

    const resp = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&limit=5`
    );
    const data = await resp.json();
    setPlaces(data);
  };

  const onPlaceSelected = async (place: any) => {
    setPlaces([]);
    if (!map) return;

    const lng = parseFloat(place.lon);
    const lat = parseFloat(place.lat);

    map.flyTo({
      center: [lng, lat],
      zoom: 14,
    });

    if (marker) marker.remove();

    const newMarker = new Marker({ color: "red" })
      .setLngLat([lng, lat])
      .addTo(map);
    setMarker(newMarker);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const start = `${position.coords.longitude},${position.coords.latitude}`;
        const end = `${lng},${lat}`;
        const url = `https://router.project-osrm.org/route/v1/driving/${start};${end}?alternatives=true&overview=full&geometries=geojson`;

        const res = await fetch(url);
        const data = await res.json();

        if (!data.routes || data.routes.length === 0) {
          alert("No se pudo calcular la ruta. Intenta otro destino.");
          return;
        }

        // Limpiar rutas previas
        map.getStyle().layers?.forEach(layer => {
          if (layer.id.startsWith("route")) map.removeLayer(layer.id);
        });
        Object.keys(map.getStyle().sources).forEach(sourceId => {
          if (sourceId.startsWith("route")) map.removeSource(sourceId);
        });

        // Ordenar por duración (la más rápida primero)
        const sortedRoutes = data.routes.sort(
          (a: any, b: any): number => a.duration - b.duration
        );

        sortedRoutes.forEach((route: any, index: number) => {
          const color = index === 0 ? "#27ae60" : "#e74c3c"; // verde = más rápida, rojo = otras
          const coords = route.geometry.coordinates;
          const duration = (route.duration / 60).toFixed(1); // minutos

          const sourceId = `route${index}`;
          const layerId = `route${index}`;

          map.addSource(sourceId, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: coords,
              },
            },
          });

          map.addLayer({
            id: layerId,
            type: "line",
            source: sourceId,
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": color,
              "line-width": 4,
              "line-opacity": 0.8,
            },
          });

          // Mostrar duración en el mapa como popup
          if (index === 0) {
            new Popup()
              .setLngLat([lng, lat])
              .setHTML(`<strong>Tiempo estimado:</strong> ${duration} min`)
              .addTo(map);
          }

          console.log(`Ruta ${index + 1}: ${duration} minutos`);
        });
      });
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="form-control futuristic-input"
        placeholder="🔍 Buscar lugar..."
        onChange={onQueryChanged}
      />

      {places.length > 0 && (
        <ul className="list-group mt-2">
          {places.map((place, i) => (
            <li
              key={i}
              className="list-group-item d-flex justify-content-between align-items-start flex-column"
            >
              <span style={{ fontSize: "0.9rem" }}>{place.display_name}</span>
              <button
                className="btn btn-sm btn-outline-primary mt-2 align-self-end"
                onClick={() => onPlaceSelected(place)}
              >
                Ir al lugar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
