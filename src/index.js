import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import AppProvider from "./context/context";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ErrorBoundary>
    <BrowserRouter>
        <AppProvider>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </AppProvider>
    </BrowserRouter>
  </ErrorBoundary>
);
