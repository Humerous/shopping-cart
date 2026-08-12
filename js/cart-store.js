import { productByTag } from './catalogue.js';

const CART_ITEMS_KEY = 'productsInCart';
const CART_COUNT_KEY = 'cartNumbers';
const CART_TOTAL_KEY = 'totalCost';
const CART_EVENT = 'cart:updated';

function normaliseStoredCart(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  return Object.entries(value).reduce((cart, [storedTag, item]) => {
    const tag = item?.tag || storedTag;
    const product = productByTag.get(tag);
    const quantity = Number.parseInt(item?.inCart, 10);

    if (product && Number.isFinite(quantity) && quantity > 0) {
      cart[tag] = {
        ...product,
        image: undefined,
        alt: undefined,
        category: undefined,
        inCart: quantity,
      };
    }
    return cart;
  }, {});
}

export function readCart() {
  try {
    return normaliseStoredCart(
      JSON.parse(localStorage.getItem(CART_ITEMS_KEY) || '{}'),
    );
  } catch {
    return {};
  }
}

export function getCartCount(cart = readCart()) {
  return Object.values(cart).reduce((total, item) => total + item.inCart, 0);
}

export function getCartSubtotal(cart = readCart()) {
  return Object.values(cart).reduce(
    (total, item) => total + item.price * item.inCart,
    0,
  );
}

export function writeCart(cart) {
  const normalisedCart = normaliseStoredCart(cart);
  localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(normalisedCart));
  localStorage.setItem(CART_COUNT_KEY, String(getCartCount(normalisedCart)));
  localStorage.setItem(CART_TOTAL_KEY, String(getCartSubtotal(normalisedCart)));
  window.dispatchEvent(new CustomEvent(CART_EVENT, { detail: normalisedCart }));
  return normalisedCart;
}

export function addItem(tag) {
  const product = productByTag.get(tag);
  if (!product) return readCart();
  const cart = readCart();
  cart[tag] = {
    name: product.name,
    tag,
    price: product.price,
    inCart: (cart[tag]?.inCart || 0) + 1,
  };
  return writeCart(cart);
}

export function changeItemQuantity(tag, amount) {
  const cart = readCart();
  if (!cart[tag]) return cart;
  const nextQuantity = cart[tag].inCart + amount;
  if (nextQuantity <= 0) delete cart[tag];
  else cart[tag].inCart = nextQuantity;
  return writeCart(cart);
}

export function removeItem(tag) {
  const cart = readCart();
  delete cart[tag];
  return writeCart(cart);
}

export function initialiseCart() {
  return writeCart(readCart());
}

export const cartUpdatedEvent = CART_EVENT;
