import { products } from './catalogue.js';
import {
  addItem,
  cartUpdatedEvent,
  getCartCount,
  initialiseCart,
} from './cart-store.js';

const currency = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
});

function updateCartCount(cart) {
  const count = getCartCount(cart);
  document.querySelectorAll('.cart-count').forEach((element) => {
    element.textContent = String(count);
    element.setAttribute(
      'aria-label',
      `${count} ${count === 1 ? 'item' : 'items'} in cart`,
    );
  });
}

function initialiseNavigation() {
  const toggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.site-nav');
  if (!toggle || !navigation) return;

  const closeNavigation = ({ returnFocus = false } = {}) => {
    toggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    toggle.querySelector('.menu-toggle-label').textContent = 'Menu';
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeNavigation();
    else {
      toggle.setAttribute('aria-expanded', 'true');
      navigation.classList.add('is-open');
      document.body.classList.add('menu-open');
      toggle.querySelector('.menu-toggle-label').textContent = 'Close';
    }
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeNavigation();
  });

  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      toggle.getAttribute('aria-expanded') === 'true'
    ) {
      closeNavigation({ returnFocus: true });
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeNavigation();
  });
}

function productCard(product) {
  return `
    <article class="product-card">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.alt}" width="500" height="375" loading="lazy" />
        <button class="quick-add" type="button" data-add-product="${product.tag}" aria-label="Add ${product.name} to cart">
          <span>Add to cart</span><span aria-hidden="true">+</span>
        </button>
      </div>
      <div class="product-details">
        <div><p class="product-category">${product.category}</p><h3>${product.name}</h3></div>
        <p class="product-price">${currency.format(product.price)}</p>
      </div>
    </article>`;
}

function showAddedStatus(product, button) {
  const toast = document.querySelector('.status-toast');
  if (!toast) return;
  toast.textContent = `${product.name} added to cart`;
  toast.classList.add('is-visible');
  button.classList.add('is-added');
  button.setAttribute('aria-label', `${product.name} added to cart`);
  button.querySelector('span:first-child').textContent = 'Added';
  window.setTimeout(() => {
    toast.classList.remove('is-visible');
    button.classList.remove('is-added');
    button.setAttribute('aria-label', `Add ${product.name} to cart`);
    button.querySelector('span:first-child').textContent = 'Add to cart';
  }, 1800);
}

function initialiseCatalogue() {
  const featured = document.querySelector('[data-products="featured"]');
  const remaining = document.querySelector('[data-products="remaining"]');
  if (!featured || !remaining) return;
  featured.innerHTML = products.slice(0, 3).map(productCard).join('');
  remaining.innerHTML = products.slice(3).map(productCard).join('');

  document.querySelectorAll('[data-add-product]').forEach((button) => {
    button.addEventListener('click', () => {
      const product = products.find(
        ({ tag }) => tag === button.dataset.addProduct,
      );
      if (!product) return;
      addItem(product.tag);
      showAddedStatus(product, button);
    });
  });
}

initialiseNavigation();
initialiseCatalogue();
updateCartCount(initialiseCart());
window.addEventListener(cartUpdatedEvent, (event) =>
  updateCartCount(event.detail),
);
