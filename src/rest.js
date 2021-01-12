import renderFilters from '../src/main.js';
import {
  DATA_POINTS
} from "../src/data.js";
import ModelDestinations from "./destinations";

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
      type: { typeName: it.type, icon: DATA_POINTS.POINTS_TYPE[it.type] },
      time: [it.date_from, it.date_to],
      city: it.destination.name,
      picture: it.destination.pictures.map((it) => it.src),
      price: it.base_price,
      offers: it.offers,
      description: it.destination.description
    }
  });
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

  renderFilters() {
    return this._load({ url: `points` })
      .then(toJSON)
      .then(parseData)
      .then(renderFilters);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(toJSON)
      .then(ModelDestinations.parseDestinations);
  }

  getOffers() {
    return this._load({ url: `offers` })
      .then(toJSON)
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


// getPoints() {
//   return this._load({url: `points`})
//     .then(toJSON)
//     .then(ModelPoint.parsePoints);
// }

// getDestinations() {
//   return this._load({url: `destinations`})
//     .then(toJSON)
//     .then(ModelDestinations.parsePoints);
// }

// getOffers() {
//   return this._load({url: `offers`})
//     .then(toJSON)
//     .then(ModelOffers.parsePoints);
// }

// createPoint({task}) {
//   return this._load({
//     url: `points`,
//     method: Method.POST,
//     body: JSON.stringify(task),
//     headers: new Headers({'Content-Type': `application/json`}),
//   })
//     .then(toJSON)
//     .then(ModelPoint.parsePoint);
// }

// updatePoint({id, data}) {
//   window.console.log(data);
//   return this._load({
//     url: `points/${id}`,
//     method: Method.PUT,
//     body: JSON.stringify(data),
//     headers: new Headers({'Content-Type': `application/json`}),
//   })
//     .then(toJSON)
//     .then(ModelPoint.parsePoint);
// }

// deleteTask({id}) {
//   return this._load({url: `points/${id}`, method: Method.DELETE});
// }
