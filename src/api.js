import { DATA_POINTS } from "./utils/data";
import ModelDestinations from "./components/Destinations";
import ModelOffers from "./components/Offers";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};

export const parsePointData = (data) => {
  return {
    id: data.id,
    type: { typeName: data.type, icon: DATA_POINTS.POINTS_TYPE[data.type] },
    time: [data.date_from, data.date_to],
    city: data.destination.name,
    picture: data.destination.pictures,
    price: Number(parseFloat(data.base_price, 10)),
    offers: data.offers,
    description: data.destination.description,
    favorite: data.is_favorite,
  };
};

export const parseUpdatedPoint = (data) => ({
  id: data.id,
  price: Number(data.base_price),
  city: data.destination.name,
  time: [data.date_from, data.date_to],
  offers: data.offers,
  favorite: data.is_favorite,
});

export const parsePointsListData = (dataList) => {
  return dataList.map(parsePointData);
};

export const toRow = (data) => {
  return {
    id: data.id,
    type: data.type,
    base_price: data.price,
    destination: {
      name: data.city,
      description: data.description,
      pictures: data.pictures,
    },
    date_from: data.time[0],
    date_to: data.time[1],
    offers: data.offers,
    is_favorite: data.favorite,
  };
};

export default class Api {
  constructor({ endPoint, authorization }) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({ url: `points` }).then(toJSON).then(parsePointsListData);
  }

  getDestinations() {
    return this._load({ url: `destinations` })
      .then(toJSON)
      .then(ModelDestinations.parsePoints);
  }

  getOffers() {
    return this._load({ url: `offers` })
      .then(toJSON)
      .then(ModelOffers.parsePoints);
  }

  updatePoint({ id, data }) {
    const preparedData = toRow(data);

    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(preparedData),
      headers: new Headers({ "Content-Type": `application/json` }),
    })
      .then(toJSON)
      .then(parseUpdatedPoint);
  }

  createPoint({ task }) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(task),
      headers: new Headers({ "Content-Type": `application/json` }),
    }).then(toJSON);
  }

  deleteTask({ id }) {
    return this._load({ url: `points/${id}`, method: Method.DELETE });
  }

  _load({ url, method = Method.GET, body = null, headers = new Headers() }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, { method, body, headers })
      .then(checkStatus)
      .catch((err) => {
        window.console.error(`fetch error: ${err}`);
        throw err;
      });
  }
}
