/* ----------------- PRODUCT ADD TO CART SELECTOR BELOW  --------------- */

let carts = document.querySelectorAll('.add-cart');

/* ----------------- PRODUCT IN STORE (OBJECTS) --------------- */

let products = [
  {
    name: 'Monopoly',
    tag: 'monopoly',
    price: 350,
    inCart: 0,
  },
  {
    name: 'Chess',
    tag: 'chess',
    price: 2350,
    inCart: 0,
  },
  {
    name: 'Scrabble',
    tag: 'scrabble',
    price: 250,
    inCart: 0,
  },
  {
    name: 'Battleship',
    tag: 'battleship',
    price: 1450,
    inCart: 0,
  },
  {
    name: 'Trivial Pursuit',
    tag: 'trivialpursuit',
    price: 1150,
    inCart: 0,
  },
  {
    name: 'Draughts',
    tag: 'draughts',
    price: 350,
    inCart: 0,
  },
  {
    name: 'Cluedo',
    tag: 'cluedo',
    price: 150,
    inCart: 0,
  },
  {
    name: 'Snakes and ladders',
    tag: 'snakesandladders',
    price: 75,
    inCart: 0,
  },
  {
    name: 'Risk',
    tag: 'risk',
    price: 3500,
    inCart: 0,
  },
];

/* ----------------- LOOP THREW PRODUCTS IN STORE --------------- */
for (let i = 0; i < carts.length; i++) {
  carts[i].addEventListener('click', () => {
    cartNumbers(products[i]);
    totalCost(products[i]);
  });
}

/* ----------------- LOAD PRODUCTS TO CART FUNCTION --------------- */
function onLoadCartNumbers() {
  let productNumbers = localStorage.getItem('cartNumbers');
  if (productNumbers) {
    document.querySelector('.cart span').textContent = productNumbers;
  }
}

/* ----------------- ADD LOCAL STORAGE CART NUMBER FUNCTION  --------------- */

function cartNumbers(product, action) {
  let productNumbers = localStorage.getItem('cartNumbers');
  productNumbers = parseInt(productNumbers);

  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);

  if (action) {
    localStorage.setItem('cartNumbers', productNumbers - 1);
    document.querySelector('.cart span').textContent = productNumbers - 1;
    console.log('action running');
  } else if (productNumbers) {
    localStorage.setItem('cartNumbers', productNumbers + 1);
    document.querySelector('.cart span').textContent = productNumbers + 1;
  } else {
    localStorage.setItem('cartNumbers', 1);
    document.querySelector('.cart span').textContent = 1;
  }
  setItems(product);
}

/* ----------------- ADD TO LOCAL STORAGE CART ITEM NUMBER FUNCTION  --------------- */
function setItems(product) {
  let productNumbers = localStorage.getItem('cartNumbers');
  productNumbers = parseInt(productNumbers);
  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);

  if (cartItems != null) {
    let currentProduct = product.tag;

    if (cartItems[currentProduct] == undefined) {
      cartItems = {
        ...cartItems,
        [currentProduct]: product,
      };
    }
    cartItems[currentProduct].inCart += 1;
  } else {
    product.inCart = 1;
    cartItems = {
      [product.tag]: product,
    };
  }

  localStorage.setItem('productsInCart', JSON.stringify(cartItems));
}

/* ----------------- TOTAL CART COST IN CART FUNCTION --------------- */
function totalCost(product, action) {
  let cart = localStorage.getItem('totalCost');

  if (action) {
    cart = parseInt(cart);

    localStorage.setItem('totalCost', cart - product.price);
  } else if (cart != null) {
    cart = parseInt(cart);
    localStorage.setItem('totalCost', cart + product.price);
  } else {
    localStorage.setItem('totalCost', product.price);
  }
}

/* ----------------- DELIVERY OPTION FUNCTION --------------- */
let deliveryOptionPrice = 0;

function deliveryOptions() {
  let deliveryOptions = document.getElementById('delivery').value;

  if (deliveryOptions == '0') {
    deliveryOptionPrice = 0.0;
  } else if (deliveryOptions == '1') {
    deliveryOptionPrice = 90;
  } else if (deliveryOptions == '2') {
    deliveryOptionPrice = 140;
  } else if (deliveryOptions == '3') {
    deliveryOptionPrice = 180;
  } else if (deliveryOptions == '4') {
    deliveryOptionPrice = 210;
  } else {
    alert('Please select an option');
  }
  displayCart();
}

/* ----------------- CREATE PRODUCTS PAGE FUNCTION --------------- */

function displayCart() {
  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);

  let cart = localStorage.getItem('totalCost');
  cart = parseInt(cart);

  let productContainer = document.querySelector('.products');

  if (cartItems && productContainer) {
    productContainer.innerHTML = '';
    Object.values(cartItems).map((item) => {
      productContainer.innerHTML += `
      <div class="container">
            <div class="table-responsive">
              <table class="table table-bordered m-0">
                          <td class="product"><i class="fas fa-trash-alt"></i>
                          <span>
                          <p class="sm-hide">${item.name}</p>
                            <img src="./images/${
                              item.tag
                            }.jpg" class="img-fluid img-thumbnail ml-2" />
                            </span>
                        <td class="price sm-hide">R ${item.price},00</td>

                            <td class="quantity">
                                <ion-icon class="decrease " name="arrow-dropleft-circle"></ion-icon>
                                    <span>${item.inCart}</span>
                                <ion-icon class="increase" name="arrow-dropright-circle"></ion-icon>   
                            </td>

                          <td class="total">R ${
                            item.inCart * item.price
                          },00</td>      
              </table>
            </div>  
      </div>`;
    });
    /* ----------------- CREATE PRODUCTS DELIVERY OPTIONS PAGE SECTION --------------- */
    productContainer.innerHTML += `<form>
    <div class="form-group">
      <label for="deliveryOptions">Delivery options</label>
      <select
        class="form-control custom-select"
        name="delivery"
        id="delivery"
        onchange="deliveryOptions()"
        ;
      >
        <option value="0">0 - Free Collection from warehouse</option>
        <option value="1"
          >1 - R90,00 delivery fee , anywhere in Cape Town area</option
        >
        <option value="2"
          >2 - R140,00 delivery fee, anywhere in local province</option
        >
        <option value="3"
          >3 - R180,00 delivery fee, Outside province</option
        >
        <option value="4">4 - R230,00 delivery fee, International</option>
      </select>
      <hr class="my-3 mb-2" />
    </div>
  </form>`;

    /* ----------------- ADD 15% VAT TO EACH PRODUCT  --------------- */
    const vatRate = 1.15;

    /* ----------------- TOTAL COST ADDED TO BASKET  --------------- */
    const totalAmountInCart = cart * vatRate + deliveryOptionPrice;
    productContainer.innerHTML += `
            <div class="basketTotal">
            <div class="mt-2">
              <h4 class="basketTotalTitle">Basket Total</h4>
            </div>
            <div class="d-flex">
              <div class="text-right mt-4">
                <label class="text-muted font-weight-normal m-0"
                  >Total price plus shipping</label
                >
                <div class="text-large mt-2">
                <strong>R ${Math.round(totalAmountInCart)},00 inc VAT
                </strong></div>
              </div>
              <hr class="my-3 mb-2" />
            </div>
            <button type="button mt-5" class="btn myButton btn-md mt-3" onclick="purchaseClicked();">
            Confirm Order
            </button>
            </div>`;
  }
  deleteButtons();
  manageQuantity();
}

/* ----------------- THANK YOU FOR YOUR PURCHASE FUNCTION ALERT --------------- */
function purchaseClicked() {
  alert('Thank you for your purchase');
}

/* ----------------- MANAGE QUANTITY IN BASKET --------------- */
function manageQuantity() {
  let decreaseButtons = document.querySelectorAll('.decrease');
  let increaseButtons = document.querySelectorAll('.increase');
  let currentQuantity = 0;
  let currentProduct = '';
  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);

  /* ----------------- DECREASE QUANTITY IN BASKET --------------- */
  for (let i = 0; i < decreaseButtons.length; i++) {
    decreaseButtons[i].addEventListener('click', () => {
      currentQuantity = decreaseButtons[i].parentElement.querySelector('span')
        .textContent;
      console.log(currentQuantity);
      currentProduct = decreaseButtons[
        i
      ].parentElement.previousElementSibling.previousElementSibling
        .querySelector('span')
        .textContent.toLocaleLowerCase()
        .replace(/ /g, '')
        .trim();
      console.log(currentProduct);

      if (cartItems[currentProduct].inCart > 1) {
        cartItems[currentProduct].inCart -= 1;
        cartNumbers(cartItems[currentProduct], 'decrease');
        totalCost(cartItems[currentProduct], 'decrease');
        localStorage.setItem('productsInCart', JSON.stringify(cartItems));
        displayCart();
      }
    });
  }
  /* ----------------- INCREASE QUANTITY IN BASKET --------------- */
  for (let i = 0; i < increaseButtons.length; i++) {
    increaseButtons[i].addEventListener('click', () => {
      currentQuantity = increaseButtons[i].parentElement.querySelector('span')
        .textContent;
      console.log(currentQuantity);
      currentProduct = increaseButtons[
        i
      ].parentElement.previousElementSibling.previousElementSibling
        .querySelector('span')
        .textContent.toLocaleLowerCase()
        .replace(/ /g, '')
        .trim();
      console.log(currentProduct);

      cartItems[currentProduct].inCart += 1;
      cartNumbers(cartItems[currentProduct]);
      totalCost(cartItems[currentProduct]);
      localStorage.setItem('productsInCart', JSON.stringify(cartItems));
      displayCart();
    });
  }
}

/* ----------------- REMOVE PRODUCTS FROM BASKET--------------- */
function deleteButtons() {
  let deleteButtons = document.querySelectorAll('.product i');
  let productNumbers = localStorage.getItem('cartNumbers');
  let cartCost = localStorage.getItem('totalCost');
  let cartItems = localStorage.getItem('productsInCart');
  cartItems = JSON.parse(cartItems);
  let productName;
  console.log(cartItems);

  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener('click', () => {
      productName = deleteButtons[i].parentElement.textContent
        .toLocaleLowerCase()
        .replace(/ /g, '')
        .trim();

      localStorage.setItem(
        'cartNumbers',
        productNumbers - cartItems[productName].inCart
      );
      localStorage.setItem(
        'totalCost',
        cartCost - cartItems[productName].price * cartItems[productName].inCart
      );

      delete cartItems[productName];
      localStorage.setItem('productsInCart', JSON.stringify(cartItems));

      displayCart();
      onLoadCartNumbers();
      deliveryOptions();
    });
  }
}

/* ----------------- CALL FUNCTIONS STRAIGHT AWAY AFTER PAGE LOADS --------------- */
displayCart();
onLoadCartNumbers();
