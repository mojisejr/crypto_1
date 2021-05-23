class SymbolSelectorView {
  constructor() {
    this.parentElement = document.querySelector(".symbol-selector-form");
  }
  _generateMarkup = (data) => {
    const html = data
      .map((data) => {
        return `<option value="${data.id}">${data.id}</option>`;
      })
      .join("");
    return html;
  };

  _generateErrorMarkup = () => {
    return `<option value="">Error</option>`;
  };

  getData() {
    const query = this.parentElement.querySelector(
      ".symbol-list-selector"
    ).value;
    if (!query) {
      return;
    }
    return query;
  }

  render(data) {
    if (!data) {
      this._clear();
      this.parentElement
        .querySelector(".symbol-list-selector")
        .insertAdjacentHTML("afterbegin", this._generateErrorMarkup());
    }
    this._clear();
    this.parentElement
      .querySelector(".symbol-list-selector")
      .insertAdjacentHTML("afterbegin", this._generateMarkup(data));
  }

  _clear() {
    this.parentElement.innerHtml = "";
  }

  renderHandler(handler) {
    window.addEventListener("load", () => handler());
  }
  addSymbolHanlder(handler) {
    this.parentElement.addEventListener("submit", (ev) => {
      ev.preventDefault();
      handler();
    });
  }
}

export default new SymbolSelectorView();
