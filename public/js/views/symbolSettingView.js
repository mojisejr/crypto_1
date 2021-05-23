import { createSettingObject } from "./../services/mapper";
export class SymbolSettingView {
  constructor() {
    this.parentElement = document.querySelector(".setting-container");
    this.inputEntryPoint = document.getElementById("entryPoint");
    this.inputPercentTPSL = document.getElementById("percentTPSL");
    this.inputSupportPrice = document.getElementById("supportPrice");
    this.inputResistantPrice = document.getElementById("resistantPrice");
  }

  renderSelector(data) {
    if (!data) return;
    this._clearSelector();
    this.parentElement
      .querySelector(".symbol-selector")
      .insertAdjacentHTML("afterbegin", this._generateSelectorMarkup(data));
  }

  _generateSelectorMarkup(symbols) {
    const html = symbols
      .map((symbol) => {
        return `<option value="${symbol}">${symbol}</option>`;
      })
      .join("");

    return html;
  }

  getData() {
    const symbol = this.parentElement.querySelector(".symbol-selector").value;
    if (!symbol) return;
    return symbol;
  }

  addUpdateSettingHanlder(handler) {
    this.parentElement
      .querySelector(".btn-update-setting")
      .addEventListener("click", () => {
        //1 data prepairing
        const formData = {
          symbol: this.getData(),
          entries: this.inputEntryPoint.value,
          percentTPSL: this.inputPercentTPSL.value,
          supportPrice: this.inputSupportPrice.value,
          resistantPrice: this.inputResistantPrice.value,
        };
        //2 object creation
        const [entries, suprst] = createSettingObject(formData);
        //3 send to controller
        handler(entries, suprst);
        this._clearInput();
      });
  }
  _clearSelector() {
    this.parentElement.querySelector(".symbol-selector").innerHTML = "";
  }
  _clearInput() {
    this.inputEntryPoint.value = "";
    this.inputPercentTPSL.value = "";
    this.inputSupportPrice.value = "";
    this.inputResistantPrice.value = "";
  }
}

export default new SymbolSettingView();
