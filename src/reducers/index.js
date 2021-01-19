import * as types from '../actions/types';
const initialState = {
  books: [],
  cart: [],
  cartModalOpen: false
}

export default (state = initialState, action) => {
  switch(action.type){
    case types.SET_BOOKS: {
      return {...state, books: action.payload}
    }
    case types.ADD_TO_CART: {
      return {...state, cart: [...state.cart, action.payload]}
    }
    case types.REMOVE_FROM_CART: {
      return {...state, cart: [...state.cart.filter(i => i.bookID !== action.payload.bookID)] }
    }
    case types.CART_MODAL_TOGGLE: {
      return {...state, cartModalOpen: action.payload}
    }
    default:
      return state
  }
}