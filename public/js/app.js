import "core-js/stable";
import "regenerator-runtime/runtime";
import * as model from "./model";
import symbolSelectorView from "./views/symbolSelectorView";
import selectedSymbolView from "./views/selectedSymbolView";
import symbolPriceView from "./views/symbolPriceView";
import symbolSettingView from "./views/symbolSettingView";

const controlSymbolSelector = async () => {
  //1 load symbol from database
  await model.loadAllSymbols();
  const { allSymbols } = model.state;
  //2 render symbol on the screen select
  symbolSelectorView.render(allSymbols);
};

const controlAddSymbol = () => {
  //1 get symbol data
  const symbol = symbolSelectorView.getData();
  if (!symbol) {
    return;
  }
  model.updateSelectedSymbol(symbol);
  const symbols = model.getSelectedSymbol();
  selectedSymbolView.render(symbols);
};

const controlWebSocket = () => {
  //1 check symbol state
  const symbols = model.getSelectedSymbol();
  if (!symbols) {
    console.log("no symbols");
    return;
  }
  //2 create websocket instance
  const ws = model.buildWebSocket(symbols);
  model.updateWebSocketInstance(ws);
  //3 open connection
  ws.onopen = () => {
    symbolSettingView.renderSelector(symbols);
  };
  ws.onmessage = (message) => {
    //4 receive and update state,
    model.updatePriceFromStream(message);
    const price = model.getPrice();
    if (!price) return;
    //5 render price box
    symbolPriceView.render(price);
  };
  ws.onclose = () => {};
  ws.onerror = (error) => {};
};

const controlUpdateSetting = (settingData) => {
  if (!settingData) {
    console.log("error setting data cannot be null or undefined");
    return;
  }
  model.updateEntryPointState(settingData);
};

const controlWebSocketDisconnect = () => {
  const ws = model.getWebSocketInstance();
  if (!ws) return;
  ws.close();
};

const app = () => {
  symbolPriceView.addRunHanlder([controlWebSocket]);
  symbolPriceView.addDisconnectHandler(controlWebSocketDisconnect);
  symbolSelectorView.renderHandler(controlSymbolSelector);
  symbolSelectorView.addSymbolHanlder(controlAddSymbol);
  symbolSettingView.addUpdateSettingHanlder(controlUpdateSetting);
};

app();
