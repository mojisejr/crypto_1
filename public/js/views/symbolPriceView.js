export class SymbolPriceView {
  constructor() {
    this.buttonMenuParentElement = document.querySelector(".menu-list-item");
    this.priceViewParentElement = document.querySelector(".price-container");
  }

  render(data) {
    if (!data) {
      this._clear();
      this._generateErrorMarkup();
      return;
    }
    this._clear();
    this.priceViewParentElement.insertAdjacentHTML(
      "afterbegin",
      this._generateMarkup(data)
    );
  }

  _generateMarkup(data) {
    let symbols = Object.entries(data).map((symbol) => symbol[1]);
    let markup = symbols
      .map((sym) => {
        return `<div id="sym" class="price-box center-text">
        <div class="symbol"> ${sym.symbol}</div>
        <div class="price">฿${sym.price}</div>
    </div>`;
      })
      .join("");
    return markup;
  }

  _generateErrorMarkup() {
    return `<h2>no data....</h2>`;
  }

  addRunHanlder(handlers) {
    this.buttonMenuParentElement
      .querySelector(".btn-run")
      .addEventListener("click", () => {
        handlers.forEach((handler) => handler());
      });
  }

  addDisconnectHandler(handler) {
    this.buttonMenuParentElement
      .querySelector(".btn-disconnect")
      .addEventListener("click", () => {
        this._clear();
        handler();
      });
  }

  _clear() {
    this.priceViewParentElement.innerHTML = "";
  }
}

export default new SymbolPriceView();
