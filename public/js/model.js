import axios from "axios";
import { createWebSocketUrl, createPriceData } from "./services/mapper";

export const state = {
  allSymbols: [],
  selectedSymbol: [],
  currentPrices: {},
  entryPoints: [],
  supRstPoints: [],
  socketEndpoint: "wss://api.bitkub.com/websocket-api/",
  ws: null,
};

const databaseUrl = "http://localhost:5234";

export const loadAllSymbols = async () => {
  const { data } = await axios.get(`${databaseUrl}/symbols`);
  if (!data) {
    throw new Error("no response symbols data from database");
  }
  state.allSymbols.push(...data);
};

export const updateSelectedSymbol = (data) => {
  const isDuplicated = state.selectedSymbol.includes(data);
  if (isDuplicated) {
    return;
  } else {
    state.selectedSymbol.push(data);
  }
  // console.log(state.selectedSymbol);
};

export const getSelectedSymbol = () => {
  if (state.selectedSymbol.length <= 0) return;
  return state.selectedSymbol;
};

export const isStreaming = (symbol) => {
  return state.selectedSymbol.includes(symbol);
};

export const updatePriceFromStream = (stream) => {
  const priceData = createPriceData(stream);
  if (!priceData) return;
  state.currentPrices[priceData.symbol] = priceData;
  // console.log(state.currentPrices);
};

export const updateEntryPointState = (entryPointToUpdate) => {
  if (!entryPointToUpdate) {
    return;
  }
  state.entryPoints.push(...entryPointToUpdate);
  console.log(state.entryPoints);
};

export const getPrice = () => {
  if (!state.currentPrices) return;
  return state.currentPrices;
};

export const buildWebSocket = (symbols) => {
  //1 create websocket url with all selected symbols
  const webSocketUrl = createWebSocketUrl(state.socketEndpoint, symbols);
  //2 create websocket instance and return
  // console.log("webSocketUrl =>", webSocketUrl);
  const webSocket = new WebSocket(webSocketUrl);
  return webSocket;
};

export const getWebSocketInstance = () => {
  if (!state.ws) return;
  return state.ws;
};

export const updateWebSocketInstance = (ws) => {
  if (!ws) return;
  state.ws = ws;
};
