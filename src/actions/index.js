import * as types from './types';

export const fetchBooks = () => dispatch => {
  fetch('https://s3-ap-southeast-1.amazonaws.com/he-public-data/books8f8fe52.json')
  .then(data => data.json())
  .then(result => dispatch({
    type: types.SET_BOOKS,
    payload: result
  }))
  .catch(err => dispatch({
    type: types.SET_BOOKS,
    payload: []
  }));
}

export const addToCart = book => dispatch => {
  dispatch({
    type: types.ADD_TO_CART,
    payload: book
  });
}

export const removeFromCart = book => dispatch => {
  dispatch({
    type: types.REMOVE_FROM_CART,
    payload: book
  });
}

export const cartModalToggle = status => dispatch => {
  dispatch({
    type: types.CART_MODAL_TOGGLE,
    payload: status
  })
}