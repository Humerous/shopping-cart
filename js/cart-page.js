import { productByTag } from './catalogue.js';
import {
  cartUpdatedEvent,
  changeItemQuantity,
  getCartCount,
  getCartSubtotal,
  readCart,
  removeItem,
} from './cart-store.js';

const currency = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
});
const cartItemsElement = document.querySelector('.cart-items');
const summaryElement = document.querySelector('.order-summary');
const deliveryElement = document.querySelector('#delivery');
const confirmationDialog = document.querySelector('.confirmation-dialog');

function itemMarkup([tag, item]) {
  const product = productByTag.get(tag);
  return `
    <article class="cart-item">
      <img src="${product.image}" alt="${product.alt}" width="180" height="135" />
      <div class="cart-item-details">
        <p class="product-category">${product.category}</p>
        <h2>${item.name}</h2>
        <p class="unit-price">${currency.format(item.price)} each</p>
        <div class="cart-item-actions">
          <div class="quantity-control" aria-label="Quantity for ${item.name}">
            <button type="button" data-decrease="${tag}" aria-label="Decrease ${item.name} quantity">−</button>
            <span aria-live="polite" aria-label="Quantity">${item.inCart}</span>
            <button type="button" data-increase="${tag}" aria-label="Increase ${item.name} quantity">+</button>
          </div>
          <button class="remove-button" type="button" data-remove="${tag}" aria-label="Remove ${item.name} from cart">Remove</button>
        </div>
      </div>
      <p class="line-total"><span>Line total</span>${currency.format(item.price * item.inCart)}</p>
    </article>`;
}

function updateTotals(cart) {
  const subtotal = getCartSubtotal(cart);
  const vat = subtotal * 0.15;
  const delivery = Number(deliveryElement.value);
  document.querySelector('[data-subtotal]').textContent =
    currency.format(subtotal);
  document.querySelector('[data-vat]').textContent = currency.format(vat);
  document.querySelector('[data-delivery]').textContent =
    currency.format(delivery);
  document.querySelector('[data-total]').textContent = currency.format(
    subtotal + vat + delivery,
  );
}

function emptyCartMarkup() {
  return `<div class="empty-cart"><h2>Your cart is empty.</h2><p>Nothing added yet.</p><p>Return to the collection and choose a game to test the cart.</p><a class="button button-dark" href="/index.html">Return to shop <span aria-hidden="true">→</span></a></div>`;
}

function renderCart(cart = readCart()) {
  const entries = Object.entries(cart);
  const count = getCartCount(cart);
  document.querySelector('.cart-heading-count').textContent =
    `${count} ${count === 1 ? 'item' : 'items'}`;
  cartItemsElement.innerHTML = entries.length
    ? entries.map(itemMarkup).join('')
    : emptyCartMarkup();
  summaryElement.hidden = entries.length === 0;
  updateTotals(cart);
}

cartItemsElement.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.decrease) changeItemQuantity(button.dataset.decrease, -1);
  if (button.dataset.increase) changeItemQuantity(button.dataset.increase, 1);
  if (button.dataset.remove) removeItem(button.dataset.remove);
});

deliveryElement.addEventListener('change', () => updateTotals(readCart()));
document
  .querySelector('.confirm-order')
  .addEventListener('click', () => confirmationDialog.showModal());
document.querySelector('.dialog-close').addEventListener('click', () => {
  confirmationDialog.close();
  window.location.href = '/index.html';
});
confirmationDialog.addEventListener('click', (event) => {
  if (event.target === confirmationDialog) confirmationDialog.close();
});
window.addEventListener(cartUpdatedEvent, (event) => renderCart(event.detail));
renderCart();
