export const createWebSocketUrl = (url, symbols) => {
  //1 mergeString with prefix
  if (!url || !symbols) {
    console.log("no url or symbols");
    return;
  }
  const symbolString = "market.ticker.thb_";
  const merged = symbols.map((sym) => symbolString + sym);
  //2 join all string wiht ","
  const joinedSymbol = merged.join(",");
  //3 connect url with joined string
  const webSocketUrl = url + joinedSymbol;
  return webSocketUrl;
};

export const createPriceData = (stream) => {
  const parsedJSON = JSON.parse(stream.data);
  if (!parsedJSON) {
    return;
  }
  const dataObject = {
    symbol: parsedJSON.stream.split("_")[1],
    price: parsedJSON.last,
  };
  return dataObject;
};

export const createSettingObject = (formData) => {
  console.log(formData);
  const entriesPoint = entryPointStrToArray(formData.entries);
  return entriesPoint.map((ent) => {
    //1 parse entry point to float
    const entry = parseFloat(ent);
    //2 calculate TP/SL price
    const tpPrice = entry + entry * parseFloat(formData.percentTPSL);
    const slPrice = entry - entry * parseFloat(formData.percentTPSL);
    //return setting object to update the state
    return {
      symbol: formData.symbol,
      entry: entry,
      tp: tpPrice,
      isTp: false,
      sl: slPrice,
      isSl: false,
    };
  });
};

const entryPointStrToArray = (entryPoints) => {
  if (!entryPoints) return;
  const entriesArray = entryPoints.split(",");
  //get rid of empty array
  const cleanArray = entriesArray.filter((entry) => {
    return entry != "";
  });
  return cleanArray;
};
