import React, { createContext, useContext, useEffect, useState } from "react";
import propTypes from "prop-types";

const Results = createContext();

export function useResults() {
  return useContext(Results);
}

export function ResultsProvider({ children }) {
  const [allRestaurantes, setAllRestaurants] = useState([]);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const restaurants = () => {};

  return (
    <Results.Provider
      value={{
        allRestaurantes,
        token,
        setToken,
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
