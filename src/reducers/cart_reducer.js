import {
  ADD_TO_CART,
  CLEAR_CART,
  COUNT_CART_TOTALS,
  REMOVE_CART_ITEM,
  TOGGLE_CART_ITEM_AMOUNT,
} from "../actions";

const cart_reducer = (state, action) => {
  if (action.type === ADD_TO_CART) {
    const { id, color, amount, product } = action.payload;
    const tempItem = state.cart.find((i) => i.id === id + color);
    if (tempItem) {
      const tempCart = state.cart.map((cartItem) => {
        if (cartItem.id === id + color) {
          let newAmount = cartItem.amount + amount;
          if (newAmount > cartItem.max) {
            newAmount = cartItem.max;
          }
          return { ...cartItem, amount: newAmount };
        } else {
          return cartItem;
        }
      });

      return { ...state, cart: tempCart };
    } else {
      const newItem = {
        id: id + color,
        name: product.name,
        color,
        amount,
        image: product.images[0].url,
        price: product.price,
        max: product.stock,
      };
      return { ...state, cart: [...state.cart, newItem] };
    }
  }
  if (action.type === REMOVE_CART_ITEM) {
    return { ...state, cart: action.payload };
  }
  if (action.type === CLEAR_CART) {
    console.log("Triggered");
    return {
      ...state,
      cart: [],
    };
  }
  if (action.type === TOGGLE_CART_ITEM_AMOUNT) {
    const { id, value } = action.payload;
    let tempProducts = [...state.cart];
    if (value === "inc") {
      tempProducts = tempProducts.map((p) => {
        //let pId = p.id;
        if (p.id === id) {
          p.amount += 1;
          if (p.amount > p.max) {
            p.amount = p.max;
          }
        }
        return p;
      });
      return { ...state, cart: [...tempProducts] };
    }
    if (value === "dec") {
      tempProducts = tempProducts.map((p) => {
        //let pId = p.id;
        if (p.id === id) {
          p.amount -= 1;
          if (p.amount < 1) {
            p.amount = 1;
          }
        }
        return p;
      });
      return { ...state, cart: [...tempProducts] };
    }
  }
  if (action.type === COUNT_CART_TOTALS) {
    let totalItems = state.cart.reduce((a, b) => {
      a += b.amount;
      return a;
    }, 0);

    let totalPrice = state.cart.reduce((a, b) => {
      a += b.price * b.amount;
      return a;
    }, 0);

    //console.log(totalItems, totalPrice);

    return { ...state, total_items: totalItems, total_amount: totalPrice };
  }
  throw new Error(`No Matching "${action.type}" - action type`);
};

export default cart_reducer;
