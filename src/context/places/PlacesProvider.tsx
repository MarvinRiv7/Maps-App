import { JSX, useEffect, useReducer } from "react";
import { PlacesContext } from "./PlacesContext";
import { placesReducer } from "./placesReducer";
import { getUSerLocation } from "../../helpers";

export interface PlacesState {
  isLoading: boolean;
  userLocation?: [number, number]
}

const INITIAL_STATE: PlacesState = {
    isLoading: true,
    userLocation: undefined
}

interface Props {
    children: JSX.Element | JSX.Element[]
}

export const PlacesProvider = ({children}: Props) => {

  const [state, dispatch] = useReducer(placesReducer, INITIAL_STATE);

  useEffect(() => {
      getUSerLocation().
      then(lngLat => dispatch({type: 'setUserLocation', payload: lngLat}))
  }, [])
  
  return (
        <PlacesContext.Provider value={{
          ...state,
        }}>
          {children}
        </PlacesContext.Provider>
  )
};
