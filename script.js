const products = async () => {
  await fetch("assets/data.json")
    .then((response) => response.json())
    .then((products) => {
      renderProducts(products);
    })
    .catch((error) => {
      console.error("Failed to load products:", error);
    });
};
products();

const allProductListContainer = document.querySelector(".allProductList");

function renderProducts(products) {
  console.log(products);
  products.forEach((product, i) => {
    allProductListContainer.innerHTML += `
      <div class="productList" data-key=${i}>
        <div class="img">
          <img src=${product.image.desktop} alt="">
          <button class="normalButton">Add Cart <img src="assets/images/icon-add-to-cart.svg" alt=""></button>
          <button class="hoverButton"><p class="minusBtn"><i class="fa-solid fa-minus"></i></p> <p class="count" data-key=${i}>0</p> <p class="plusBtn"><i class="fa-solid fa-plus"></i></p></button>
        </div>
        <div class="productDetails">
          <p class="category">${product.category}</p>
          <h3 class="productName">${product.name}</h3>
          <p class="productPrice">$ ${product.price}</p>
        </div>
      </div>
    `;
  });

  setCartFunctionality();
}

let cartProducts = [];

function setCartFunctionality() {
  const cartButtonAll = document.querySelectorAll(".normalButton");
  const hoverButtonAll = document.querySelectorAll(".hoverButton");
  const plusBtnAll = document.querySelectorAll(".plusBtn");
  const minusBtnAll = document.querySelectorAll(".minusBtn");

  plusBtnAll.forEach((btn) => {
    btn.addEventListener("click", cartCount);
  });

  minusBtnAll.forEach((btn) => {
    btn.addEventListener("click", cartCount);
  });

  cartButtonAll.forEach((btn, i) => {
    btn.addEventListener("mouseenter", () => {
      hoverButtonAll.forEach((hoverBtn, index) => {
        if (i == index) {
          hoverBtn.style.display = "flex";
        }
      });
    });
  });

  hoverButtonAll.forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.style.display = "flex";
    });
  });

  hoverButtonAll.forEach((btn, i) => {
    btn.addEventListener("mouseleave", (e) => {
      const clickedProduct = e.target.closest(".productList");
      const countEle = clickedProduct.querySelector(".count");
      if (countEle.textContent > 0) {
        btn.classList.add("active");
        cartButtonAll.forEach((cartBtn, index) => {
          if (i == index) {
            cartBtn.style.display = "none";
          }
        });
      } else {
        btn.style.display = "none";
        cartButtonAll.forEach((cartBtn, index) => {
          if (i == index) {
            cartBtn.style.display = "flex";
          }
        });
        btn.classList.remove("active");
      }
    });
  });
}

function cartCount(e) {
  const isPlusBtn = e.target.className;
  const clickedProduct = e.target.closest(".productList");
  const countEle = clickedProduct.querySelector(".count");

  if (isPlusBtn == "fa-solid fa-plus") {
    let count = Number(countEle.textContent) + 1;
    countEle.textContent = count;
    addCart(count, clickedProduct);
  } else {
    let currCount = Number(countEle.textContent);
    if (currCount <= 0) return;
    let count = currCount - 1;
    countEle.textContent = count;
    removeCart(count, clickedProduct);
  }
}

function addCart(count, clickedProduct) {
  const productDetails = clickedProduct.querySelector(".productDetails");
  const productName = productDetails.querySelector(".productName").textContent;
  const productPrice =
    productDetails.querySelector(".productPrice").textContent;
  const productId = clickedProduct.getAttribute("data-key");

  cartProducts = cartProducts.filter((product) => product.id !== productId);

  cartProducts.push({
    id: productId,
    name: productName,
    price: productPrice,
    count: count,
  });

  showCartProducts(cartProducts);
  orderTotalPrice(cartProducts);
  showCartLength(cartProducts);
}

function removeCart(count, clickedProduct) {
  const productId = clickedProduct.getAttribute("data-key");

  cartProducts = cartProducts
    .map((product) => {
      if (product.id === productId) {
        product.count = count;
      }
      return product;
    })
    .filter((product) => product.count > 0);

  showCartProducts(cartProducts);
  orderTotalPrice(cartProducts);
  showCartLength(cartProducts);
}

const noCartImg = document.querySelector(".noCartImg");
const cartBox = document.querySelector("#cart");
const cartListssContainer = document.querySelector(".cartListss");
const totalOrderPrice = document.querySelector(".totalOrderPrice");
const carbonBox = document.querySelector(".carbonBox");
const totalPriceDiv = document.querySelector(".totalPrice");
const confirmOrderBtn = document.querySelector(".confirmOrder");
const confirmationBox = document.querySelector(".orderConfirmation");
const startNewOrderBtn = document.querySelector(".startNewOrder");
const tostMessageBox = document.querySelector(".tostMessage");

confirmOrderBtn.addEventListener("click", () => {
  confirmationBox.style.display = "flex";
  const confirmationListContainer = document.querySelector(".confirmationList");
  const confirmtotalOrderPrice = document.querySelector(
    ".confirmtotalOrderPrice"
  );

  confirmationListContainer.innerHTML = "";
  if (cartProducts.length == 0) {
    noCartImg.style.display = "flex";
    cartBox.style.display = "none";
  } else {
    cartBox.style.display = "flex";
    noCartImg.style.display = "none";
    cartProducts.forEach((cartproduct) => {
      confirmationListContainer.innerHTML += `
        <div class="cartList">
          <div class="cartDetails">
            <h5>${cartproduct.name}</h5>
            <div class="details">
              <small>${cartproduct.count}x</small>
              <p>@${cartproduct.price}</p>
              <p class="cartPrice">$${cartTotalPrice(
                cartproduct.count,
                cartproduct.price
              )}</p>
            </div>
          </div>
        </div>
      `;
    });
  }

  if (cartProducts) {
    let orderTotal = cartProducts.reduce((total, product) => {
      return total + cartTotalPrice(product.count, product.price);
    }, 0);
    confirmtotalOrderPrice.textContent = `$ ${orderTotal}`;
  }
});

function showCartProducts(cartProducts) {
  cartListssContainer.innerHTML = "";

  if (cartProducts.length == 0) {
    noCartImg.style.display = "flex";
    cartBox.style.display = "none";
  } else {
    cartBox.style.display = "flex";
    noCartImg.style.display = "none";
    cartProducts.forEach((cartproduct) => {
      cartListssContainer.innerHTML += `
        <div class="cartList" data-id="${cartproduct.id}">
          <div class="cartDetails">
            <h5>${cartproduct.name}</h5>
            <div class="details">
              <small>${cartproduct.count}x</small>
              <p>@${cartproduct.price}</p>
              <p class="cartPrice">$${cartTotalPrice(
                cartproduct.count,
                cartproduct.price
              )}</p>
            </div>
          </div>
          <div class="closeImg">
            <img src="assets/images/icon-remove-item.svg" alt="icon">
          </div>
        </div>
      `;
    });
  }
  const closeBtn = document.querySelectorAll(".closeImg");

  closeBtn.forEach((btn) => {
    btn.addEventListener("click", removeProductFromTheCart);
  });
}

function cartTotalPrice(count, price) {
  let total = count * Number(price.replace(/[^0-9.]/g, ""));
  return total;
}

function orderTotalPrice(cartProducts) {
  if (cartProducts) {
    let orderTotal = cartProducts.reduce((total, product) => {
      return total + cartTotalPrice(product.count, product.price);
    }, 0);
    totalOrderPrice.textContent = `$ ${orderTotal}`;
  }
}

function showCartLength(cartProducts) {
  const cartLengthEle = document.querySelector(".cartLength");
  cartLengthEle.textContent = cartProducts.length;
}

function removeProductFromTheCart(e) {
  const clickedBtn = e.target.closest(".closeImg");
  const clickedProduct = clickedBtn.closest(".cartList");

  if (!clickedProduct) return;

  const productId = clickedProduct.getAttribute("data-id");

  cartProducts = cartProducts.filter((product) => product.id !== productId);

  const allProductList = document.querySelectorAll(".productList");
  allProductList.forEach((product) => {
    if (product.getAttribute("data-key") === productId) {
      product.querySelector(".count").textContent = "0";
    }
  });
  showCartProducts(cartProducts);
  orderTotalPrice(cartProducts);
  showCartLength(cartProducts);
}

startNewOrderBtn.addEventListener("click", () => {
  confirmationBox.style.display = "none";
  tostMessageBox.style.opacity = 1;
  setTimeout(() => {
    tostMessageBox.style.opacity = 0;
    location.reload();
  }, 2000);
});

showCartProducts(cartProducts);
