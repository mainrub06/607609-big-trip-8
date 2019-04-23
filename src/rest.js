import renderFilters from '../src/main.js';
import {
  DATA_POINTS
} from "../src/data.js";
import ModelDestinations from "./destinations";
import ModelOffers from "./offers";
import moment from "moment";

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

const parseData = (data) => {
  return data.map((it) => {
    return {
      id: it.id,
      type: { typeName: it.type, icon: DATA_POINTS.POINTS_TYPE[it.type] },
      time: [it.date_from, it.date_to],
      city: it.destination.name,
      picture: it.destination.pictures,
      price: it.base_price,
      offers: it.offers,
      description: it.destination.description,
      favorite: it.is_favorite
    }
  });
};

export const toRow = (data) => {
  return {
    'id': data.id,
    'type': data.type,
    'base_price': data.price,
    'destination': {
      'name': data.city,
      'description': data.description,
      'pictures': data.pictures,
    },
    'date_from': data.time[0],
    'date_to': data.time[1],
    'offers': data.offers,
    'is_favorite': data.favorite
  };
};

export default class API {
  constructor({ endPoint, authorization }) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({ url: `points` })
      .then(toJSON)
      .then(parseData);
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
    window.console.log(data);
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({ 'Content-Type': `application/json` }),
    })
      .then(toJSON);
  }

  createPoint({ task }) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(task),
      headers: new Headers({ 'Content-Type': `application/json` }),
    })
      .then(toJSON);
  }

  deleteTask({id}) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
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
