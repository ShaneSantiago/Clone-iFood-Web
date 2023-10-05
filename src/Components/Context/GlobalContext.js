import React, { createContext, useContext, useState } from "react";
import propTypes from "prop-types";

const Results = createContext();

export function useResults() {
  return useContext(Results);
}

export function ResultsProvider({ children }) {
  const [allRestaurantes, setAllRestaurants] = useState([]);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);

  const restaurants = () => {
    // Sua lógica para buscar e atualizar os restaurantes aqui
  };

  return (
    <Results.Provider
      value={{
        allRestaurantes,
        setAllRestaurants,
        restaurants,
        cart,
        setCart,
      }}
    >
      {children}
    </Results.Provider>
  );
}
ResultsProvider.propTypes = {
  children: propTypes.node.isRequired, // Certifique-se de importar PropTypes
};
