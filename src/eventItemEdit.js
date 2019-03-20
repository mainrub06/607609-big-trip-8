import {createElement} from "../src/utils.js";

export class EventItemEdit {
  constructor(data) {
    this._type = data.type;
    this._city = data.city;
    this._time = data.time;
    this._picture = data.picture;
    this._price = data.price;
    this._offers = data.offers;
    this._description = data.description;
    this._element = createElement(this.template).firstElementChild;
    this._state = {
      // Состояние компонента
    };
    this._onEdit = null;
  }

  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    typeof this._onSubmit === `function` && this._onSubmit();
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  get template() {
    return `<article class="point">
    <form action="" method="get">
      <header class="point__header">
        <label class="point__date">
          choose day
          <input class="point__input" type="text" placeholder="MAR 18" name="day">
        </label>

        <div class="travel-way">
          <label class="travel-way__label" for="travel-way__toggle">${this._type.icon}</label>

          <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle">

          <div class="travel-way__select">
            <div class="travel-way__select-group">
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi" name="travel-way" value="taxi" ${this._type.icon === `🚕` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-taxi">🚕 taxi</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus" name="travel-way" value="bus" ${this._type.icon === `🚌` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-bus">🚌 bus</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train" name="travel-way" value="train" ${this._type.icon === `🚂` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-train">🚂 train</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight" name="travel-way" value="train" ${this._type.icon === `✈️` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-flight">✈️ flight</label>
            </div>

            <div class="travel-way__select-group">
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in" name="travel-way" value="check-in" ${this._type.icon === `🏨` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-check-in">🏨 check-in</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing" name="travel-way" value="sight-seeing" ${this._type.icon === `🏛` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-sightseeing">🏛 sightseeing</label>
            </div>
          </div>
        </div>

        <div class="point__destination-wrap">
          <label class="point__destination-label" for="destination">${this._type.typeName} to</label>
          <input class="point__destination-input" list="destination-select" id="destination" value="${this._city}" name="destination">
          <datalist id="destination-select">
            <option value="airport"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
            <option value="hotel"></option>
          </datalist>
        </div>

        <label class="point__time">
          choose time
          <input class="point__input" type="text" value="${this._time[0]} — ${this._time[1]}" name="time" placeholder="${this._time[0]} — ${this._time[1]}">
        </label>

        <label class="point__price">
          write price
          <span class="point__price-currency">€</span>
          <input class="point__input" type="text" value="${this._price}" name="price">
        </label>

        <div class="point__buttons">
          <button class="point__button point__button--save" type="submit">Save</button>
          <button class="point__button" type="reset">Delete</button>
        </div>

        <div class="paint__favorite-wrap">
          <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite">
          <label class="point__favorite" for="favorite">favorite</label>
        </div>
      </header>

      <section class="point__details">
        <section class="point__offers">
          <h3 class="point__details-title">offers</h3>

          <div class="point__offers-wrap">
            ${this.makeOffer(this._offers)}
          </div>

        </section>
        <section class="point__destination">
          <h3 class="point__details-title">Destination</h3>
          <p class="point__destination-text">${this._description}</p>
          <div class="point__destination-images">
            <img src="${this._picture}" alt="picture from place" class="point__destination-image">
            <img src="${this._picture}" alt="picture from place" class="point__destination-image">
            <img src="${this._picture}" alt="picture from place" class="point__destination-image">
            <img src="${this._picture}" alt="picture from place" class="point__destination-image">
            <img src="${this._picture}" alt="picture from place" class="point__destination-image">
          </div>
        </section>
        <input type="hidden" class="point__total-price" name="total-price" value="">
      </section>
    </form>
  </article>
  `.trim();
  }

  makeOffer(offers) {
    let htmlBtnOffer = ``;
    for (let item of offers) {
      const nameId = item[0].toLowerCase().replace(/ /g, `-`);
      htmlBtnOffer +=
        `<input class="point__offers-input visually-hidden" type="checkbox" id="${nameId}" name="offer" value="${nameId}">
      <label for="${nameId}" class="point__offers-label">
        <span class="point__offer-service">${item[0]}</span> + €<span class="point__offer-price">${item[1]}</span>
      </label>`;
    }
    return htmlBtnOffer;
  }

  get element() {
    return this._element;
  }

  render() {
    this.bind();
    return this._element;
  }

  bind() {
    this._element.querySelector(`.point__button--save`)
      .addEventListener(`submit`, this._onSubmitButtonClick.bind(this));
  }

  unbind() {
    this._element.querySelector(`.point__button--save`)
      .removeEventListener(`submit`, this._onSubmitButtonClick.bind(this));
  }
}
