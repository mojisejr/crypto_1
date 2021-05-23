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
  notifyMesssage: "",
  wsClose: false,
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
  return new Promise((resolve, reject) => {
    resolve((state.currentPrices[priceData.symbol] = priceData));
  });
  // console.log(state.currentPrices);
};

export const updateEntryPointState = (entryPointToUpdate) => {
  if (!entryPointToUpdate) {
    return;
  }
  state.entryPoints.push(...entryPointToUpdate);
  console.log("entry point => ", state.entryPoints);
};

export const updateSupportResistantState = (supportResistantToUpdate) => {
  if (!supportResistantToUpdate) {
    return;
  }
  state.supRstPoints.push(supportResistantToUpdate);
  console.log("sprst point=>", state.supRstPoints);
};

export const checkTPSL = (currentPrice) => {
  if (state.entryPoints.length <= 0) return;
  state.entryPoints.forEach(async (symbol, index) => {
    const price = currentPrice[symbol.symbol].price;
    if (price >= symbol.tp && symbol.isTp == false && symbol.isSL == false) {
      state.entryPoints[index].isTp = true;
      state.notifyMesssage = `${symbol.symbol.toUpperCase()} tp ที่ราคา ฿${price} ตำแหน่ง tp ที่ตั้งไว้ ฿${
        symbol.tp
      }`;
      await sendNotification(state.notifyMesssage);
      console.log("tp", state.entryPoints);
    }
    if (price <= symbol.sl && symbol.isSl == false && symbol.isTp == false) {
      state.entryPoints[index].isSl = true;
      state.notifyMesssage = `${symbol.symbol.toUpperCase()} sl ที่ราคา ฿${price} ตำแหน่ง sl ที่ตั้งไว้ ฿${
        symbol.sl
      }`;
      await sendNotification(state.notifyMesssage);
      console.log("sl", state.entryPoints);
    }
  });
};

export const checkSupportResistant = (currentPrice) => {
  if (state.supRstPoints.length <= 0) return;
  state.supRstPoints.forEach(async (symbol, index) => {
    const price = currentPrice[symbol.symbol].price;
    if (price >= symbol.resistant && symbol.up == false) {
      state.supRstPoints[index].up = true;
      state.notifyMesssage = `${symbol.symbol.toUpperCase()} break แนวต้าน ฿${
        symbol.resistant
      } ไปที่ราคา ฿${price}`;
      await sendNotification(state.notifyMesssage);
      console.log("break แนวต้าน", state.supRstPoints);
    } else if (price >= symbol.resistant && symbol.up == true) {
      return;
    } else {
      state.supRstPoints[index].up = false;
    }
    if (price <= symbol.support && symbol.down == false) {
      state.supRstPoints[index].down = true;
      state.notifyMesssage = `${symbol.symbol.toUpperCase()} break แนวรับ ฿${
        symbol.resistant
      } ไปที่ราคา ฿${price}`;
      console.log("break  แนวรับ", state.supRstPoints);
      await sendNotification(state.notifyMesssage);
    } else if (price <= symbol.resistant && symbol.down == true) {
      return;
    } else {
      state.supRstPoints[index].down = false;
    }
  });
};

const sendNotification = async (message) => {
  if (!message) {
    return;
  }
  await axios.post("http://localhost:3000/notify", {
    message: message,
  });
};

export const getPrice = () => {
  if (!state.currentPrices) return;
  return new Promise((resolve, reject) => {
    resolve(state.currentPrices);
  });
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
