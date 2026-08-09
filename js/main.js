const products = [
  { name: 'Monopoly', tag: 'monopoly', price: 350 },
  { name: 'Chess', tag: 'chess', price: 2350 },
  { name: 'Scrabble', tag: 'scrabble', price: 250 },
  { name: 'Battleship', tag: 'battleship', price: 1450 },
  { name: 'Trivial Pursuit', tag: 'trivialpursuit', price: 1150 },
  { name: 'Draughts', tag: 'draughts', price: 350 },
  { name: 'Cluedo', tag: 'cluedo', price: 150 },
  { name: 'Snakes and ladders', tag: 'snakesandladders', price: 75 },
  { name: 'Risk', tag: 'risk', price: 3500 },
];

const CART_ITEMS_KEY = 'productsInCart';
const CART_COUNT_KEY = 'cartNumbers';
const CART_TOTAL_KEY = 'totalCost';

let deliveryOptionPrice = 0;

function readCartItems() {
  try {
    const stored = localStorage.getItem(CART_ITEMS_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function getCartCount(cartItems) {
  return Object.values(cartItems).reduce(
    (total, item) => total + Number(item.inCart || 0),
    0
  );
}

function getCartSubtotal(cartItems) {
  return Object.values(cartItems).reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.inCart || 0),
    0
  );
}

function syncCartState(cartItems) {
  const count = getCartCount(cartItems);
  const subtotal = getCartSubtotal(cartItems);

  localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartItems));
  localStorage.setItem(CART_COUNT_KEY, String(count));
  localStorage.setItem(CART_TOTAL_KEY, String(subtotal));

  const cartLink = document.querySelector('.cart .nav-link');

  if (cartLink) {
    let cartCount = cartLink.querySelector('.cart-count');

    if (!cartCount) {
      cartCount =
        cartLink.querySelector('span') || document.createElement('span');

      cartCount.className = 'cart-count';
      cartLink.appendChild(cartCount);
    }

    cartCount.textContent = ` ${count}`;
  }
}

function addToCart(product) {
  if (!product) return;

  const cartItems = readCartItems();
  const existing = cartItems[product.tag];

  cartItems[product.tag] = existing
    ? { ...existing, inCart: Number(existing.inCart || 0) + 1 }
    : { ...product, inCart: 1 };

  syncCartState(cartItems);
}

function changeQuantity(tag, amount) {
  const cartItems = readCartItems();
  const item = cartItems[tag];

  if (!item) return;

  const nextQuantity = Number(item.inCart || 0) + amount;

  if (nextQuantity < 1) return;

  item.inCart = nextQuantity;
  cartItems[tag] = item;

  syncCartState(cartItems);
  displayCart();
}

function removeFromCart(tag) {
  const cartItems = readCartItems();

  if (!cartItems[tag]) return;

  delete cartItems[tag];

  syncCartState(cartItems);
  displayCart();
}

function deliveryOptions() {
  const deliverySelect = document.getElementById('delivery');

  if (!deliverySelect) return;

  const prices = {
    0: 0,
    1: 90,
    2: 140,
    3: 180,
    4: 230,
  };

  deliveryOptionPrice = prices[deliverySelect.value] ?? 0;

  displayCart();
}

function purchaseClicked() {
  alert('Thank you for your purchase');
}

function displayCart() {
  const productContainer = document.querySelector('.products');

  if (!productContainer) return;

  const cartItems = readCartItems();
  const entries = Object.entries(cartItems);

  if (entries.length === 0) {
    syncCartState({});

    productContainer.innerHTML = `
      <tr>
        <td colspan="4" class="text-center py-4">
          Your cart is empty.
        </td>
      </tr>
    `;

    return;
  }

  const productRows = entries
    .map(
      ([tag, item]) => `
        <tr>
          <td class="product">
            <button
              type="button"
              class="btn p-0 mr-2 align-top"
              data-remove="${tag}"
              aria-label="Remove ${item.name} from cart"
            >
              <i class="fas fa-trash-alt" aria-hidden="true"></i>
            </button>

            <span>
              <p class="sm-hide">${item.name}</p>

              <img
                src="./images/${tag}.jpg"
                class="img-fluid img-thumbnail ml-2"
                alt="${item.name}"
              />
            </span>
          </td>

          <td class="price sm-hide">
            R ${item.price},00
          </td>

          <td class="quantity">
            <button
              type="button"
              class="btn p-0"
              data-decrease="${tag}"
              aria-label="Decrease ${item.name} quantity"
            >
              <ion-icon
                class="decrease"
                name="arrow-dropleft-circle"
                aria-hidden="true"
              ></ion-icon>
            </button>

            <span>${item.inCart}</span>

            <button
              type="button"
              class="btn p-0"
              data-increase="${tag}"
              aria-label="Increase ${item.name} quantity"
            >
              <ion-icon
                class="increase"
                name="arrow-dropright-circle"
                aria-hidden="true"
              ></ion-icon>
            </button>
          </td>

          <td class="total">
            R ${Number(item.inCart) * Number(item.price)},00
          </td>
        </tr>
      `
    )
    .join('');

  const subtotal = getCartSubtotal(cartItems);
  const totalAmountInCart = subtotal * 1.15 + deliveryOptionPrice;

  productContainer.innerHTML = `
    ${productRows}

    <tr>
      <td colspan="4">
        <form>
          <div class="form-group">
            <label for="delivery">Delivery options</label>

            <select
              class="form-control custom-select"
              name="delivery"
              id="delivery"
            >
              <option value="0">
                0 - Free Collection from warehouse
              </option>

              <option value="1">
                1 - R90,00 delivery fee, anywhere in Cape Town area
              </option>

              <option value="2">
                2 - R140,00 delivery fee, anywhere in local province
              </option>

              <option value="3">
                3 - R180,00 delivery fee, outside province
              </option>

              <option value="4">
                4 - R230,00 delivery fee, International
              </option>
            </select>
          </div>
        </form>

        <div class="basketTotal">
          <div class="mt-2">
            <h4 class="basketTotalTitle">Basket Total</h4>
          </div>

          <div class="d-flex">
            <div class="text-right mt-4">
              <label class="text-muted font-weight-normal m-0">
                Total price plus shipping
              </label>

              <div class="text-large mt-2">
                <strong>
                  R ${Math.round(totalAmountInCart)},00 inc VAT
                </strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            id="confirm-order"
            class="btn myButton btn-md mt-3"
          >
            Confirm Order
          </button>
        </div>
      </td>
    </tr>
  `;

  const deliverySelect = document.getElementById('delivery');

  if (deliverySelect) {
    const deliveryValue = Object.entries({
      0: 0,
      1: 90,
      2: 140,
      3: 180,
      4: 230,
    }).find(([, price]) => price === deliveryOptionPrice)?.[0];

    deliverySelect.value = deliveryValue || '0';
    deliverySelect.addEventListener('change', deliveryOptions);
  }

  document.querySelectorAll('[data-decrease]').forEach((control) => {
    control.addEventListener('click', () => {
      changeQuantity(control.dataset.decrease, -1);
    });
  });

  document.querySelectorAll('[data-increase]').forEach((control) => {
    control.addEventListener('click', () => {
      changeQuantity(control.dataset.increase, 1);
    });
  });

  document.querySelectorAll('[data-remove]').forEach((control) => {
    control.addEventListener('click', () => {
      removeFromCart(control.dataset.remove);
    });
  });

  const confirmOrder = document.getElementById('confirm-order');

  if (confirmOrder) {
    confirmOrder.addEventListener('click', purchaseClicked);
  }
}

document.querySelectorAll('.add-cart').forEach((button, index) => {
  button.addEventListener('click', () => {
    addToCart(products[index]);
  });
});

syncCartState(readCartItems());
displayCart();
