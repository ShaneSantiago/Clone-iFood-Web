import { ChakraProvider, theme } from "@chakra-ui/react";
import "./App.css";
import React from "react";
import Routers from "./Routes/routes";
import { ResultsProvider } from "./Components/Context/GlobalContext";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ResultsProvider>
        <Routers />
      </ResultsProvider>
    </ChakraProvider>
  );
}

export default App;
