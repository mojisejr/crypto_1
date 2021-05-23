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
  ws.onmessage = async (message) => {
    //4 receive and update state,
    await model.updatePriceFromStream(message);
    const price = await model.getPrice();
    if (!price) return;
    //5 render price box
    symbolPriceView.render(price);
    model.checkTPSL(price);
    model.checkSupportResistant(price);
  };
  ws.onclose = () => {
    //on auto close will be reconnect the ws
    if (model.state.wsClose == false) {
      console.log("connection closed... reconnect in 3 sec");
      setTimeout(() => {
        console.log("connected");
        controlWebSocket();
      }, 3000);
    }
  };
  ws.onerror = (error) => {};
};

const controlUpdateSetting = (tpsl, suprst) => {
  if (!tpsl || !suprst) {
    console.log("error setting data cannot be null or undefined");
    return;
  }
  model.updateEntryPointState(tpsl);
  model.updateSupportResistantState(suprst);
};

const controlWebSocketDisconnect = () => {
  const ws = model.getWebSocketInstance();
  if (!ws) return;
  model.state.wsClose = true;
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
