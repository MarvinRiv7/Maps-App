import type { Map, Map as MaplibreMap } from "maplibre-gl";
import { createContext } from "react";


interface MapContextProps {
    isMapReady: boolean,
    map?: Map;

    //Methods
    setMap: (map: Map) => void
}

export const MapContext = createContext({} as MapContextProps)