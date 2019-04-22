import {
  Filter
} from '../src/filter.js';
import {
  FILTERS_ARRAY
} from '../src/data.js';
import {
  removeElements,
  deletePoint,
  EMPTY_POINT_DATA
} from '../src/utils.js';
import {
  EventItem
} from '../src/eventItem.js';
import {
  EventItemEdit
} from '../src/eventItemEdit.js';
import {
  forLinter
} from '../src/stat.js';
import API from '../src/rest.js';
import observer from './store/observer';
import state from './store/state';
import * as actionTypes from './store/action-types';
import { runAction } from './store/actions.js';

const filtersBlock = document.querySelector(`.trip-filter`);
const buttonNewPoint = document.querySelector(`.new-event`);
const pointsBlock = document.querySelector(`.trip-day__items`);

export const renderFilters = (events, destinations) => {
  FILTERS_ARRAY.forEach((it) => {
    const filter = new Filter(it);
    filter.render();
    filtersBlock.appendChild(filter.element);

    filter.onFilter = () => {
      const filteredArray = filter.getFilteredArray(events);
      removeElements(`.trip-point`, `.point`);
      renderPoints(filteredArray, destinations);
    };
  });
};

export const renderPoints = (events, destinations, offers) => {

  for (const event of events) {
    const point = new EventItem(event);
    const pointEdit = new EventItemEdit(event, destinations, offers);
    point.render();
    pointsBlock.appendChild(point.element);

    point.onEdit = () => {
      pointEdit.render();
      pointsBlock.replaceChild(pointEdit.element, point.element);
      point.unrender();
    };

    pointEdit.onSubmit = (newData) => {
      point.update(newData);
      pointEdit.update(newData);
      runAction(actionTypes.UPDATE_POINT_DATA, newData);
      point.render();
      pointsBlock.replaceChild(point.element, pointEdit.element);
      pointEdit.unrender();
    };

    pointEdit.onDelete = () => {
      deletePoint(events, pointEdit);
      pointsBlock.removeChild(pointEdit.element);
      pointEdit.unrender();
    };
  }
};

runAction(actionTypes.FETCH_ALL_DATA);

observer.on((type) => {
  if (type === `SET_ALL_DATA`) {
    renderPoints(state.points, state.destinations, state.offers);
    renderFilters(state.points, state.destinations, state.offers);
  }

  buttonNewPoint.addEventListener(`click`, () => {
    let newPoint =  new EventItem(EMPTY_POINT_DATA, state.destinations, state.offers);
    let newPointEdit = new EventItemEdit(EMPTY_POINT_DATA, state.destinations, state.offers);
    newPointEdit.render();
    pointsBlock.insertBefore(newPointEdit.element, pointsBlock.firstChild);

    newPoint.onSubmit = (newData) => {
      window.console.log(newData);
      // provider.createPoint({ point: newData });
    };
  });
});

const tableBtn = document.querySelector(`.view-switch__item:first-child`);
const statBtn = document.querySelector(`.view-switch__item:nth-child(2)`);
const tableBlock = document.querySelector(`.main`);
const statBlock = document.querySelector(`.statistic`);

const onTableBtn = () => {
  statBtn.classList.remove(`view-switch__item--active`);
  tableBtn.classList.add(`view-switch__item--active`);
  tableBlock.classList.remove(`visually-hidden`);
  statBlock.classList.add(`visually-hidden`);
  tableBtn.removeEventListener(`click`, onTableBtn);
  statBtn.addEventListener(`click`, onStatBtn);
};

const onStatBtn = () => {
  statBtn.classList.add(`view-switch__item--active`);
  tableBtn.classList.remove(`view-switch__item--active`);
  tableBlock.classList.add(`visually-hidden`);
  statBlock.classList.remove(`visually-hidden`);

  statBtn.removeEventListener(`click`, onStatBtn);
  tableBtn.addEventListener(`click`, onTableBtn);
};

statBtn.addEventListener(`click`, onStatBtn);

forLinter();
