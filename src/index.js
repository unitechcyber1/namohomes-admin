import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import AppProvider from "./context/context";
import axios from "axios";
import Cookies from "js-cookie";
import { ApolloProvider } from '@apollo/client';
import client from './client';

axios.interceptors.request.use((request) => {
  request.headers.Authorization = `Bearer ${Cookies.get("token")}`;
  return request;
});
axios.interceptors.response.use((response) => {
  response.headers.Authorization = `Bearer ${Cookies.get("token")}`;
  return response;
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
  <ApolloProvider client={client}>
    <AppProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </AppProvider>
    </ApolloProvider>
  </BrowserRouter>
);

reportWebVitals();
