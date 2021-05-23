class SelectedSymbolView {
  constructor() {
    this.parentElement = document.querySelector(".selected-symbol-container");
  }
  _generateMarkup = (data) => {
    const html = data
      .map((data) => {
        return `<li>${data}</li>`;
      })
      .join("");
    return html;
  };

  _generateErrorMarkup = () => {
    return `<li">selected symbols append here</li>`;
  };

  render(data) {
    if (!data) {
      this._clear();
      this.parentElement
        .querySelector(".selected-symbol-list")
        .insertAdjacentHTML("afterbegin", this._generateErrorMarkup());
    }
    this._clear();
    this.parentElement
      .querySelector(".selected-symbol-list")
      .insertAdjacentHTML("afterbegin", this._generateMarkup(data));
  }

  _clear() {
    this.parentElement.innerHtml = "";
    this.parentElement.querySelector(".selected-symbol-list").innerHTML = "";
  }
}

export default new SelectedSymbolView();
