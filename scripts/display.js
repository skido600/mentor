class view {
  constructor() {
    this.cart = [];
    this.main = document.querySelector(".wrapper");
    this.footer = document.querySelector("footer");
    this.icon = document.getElementById("icon");
    // console.log(this.footer);
  }
  async fetch() {
    try {
      let data = await fetch("../data.json");
      let result = await data.json();
      this.display(result);
    } catch (err) {
      console.log(err);
    }
  }
  display(goods) {
    goods.forEach((item, key) => {
      const article = document.createElement("article");
      article.classList.add("mt-4");
      ///image size
      let img;
      if (window.innerWidth > 1024) {
        img = item.image.desktop;
      } else if (window.innerWidth > 650) {
        img = item.image.tablet;
      } else {
        img = item.image.mobile;
      }
      article.innerHTML += `<img
            src=${img}
            alt=${item.name}
          />
          <div
          data-id="${item.name}"
            class="btn font-bold"
          >
            <img src="../assets/images/icon-add-to-cart.svg" alt="cart" />
            Add to Cart
          </div>

          <div class="text">
            <h6 class="font-extralight text-[#c9aea6]">${item.category}</h6>
            <h5 class="text-2xl font-bold">${item.name}</h5>
           <p class="price font-bold text-xl">$${item.price.toFixed(2)}</p>  
                  </div>`;

      //btn
      let btn = article.querySelectorAll(".btn");

      btn.forEach((btns) => {
        btns.addEventListener("click", (e) => {
          let divBtn = document.createElement("div");
          divBtn.innerHTML = `<div data-set="${item.name}" class="btn1">
                 <img class="decrement" src="../assets/images/icon-decrement-quantity.svg" alt="" class="circle" />
                 <p  class="value">1</p>
                 <img  class="increment" src="../assets/images/icon-increment-quantity.svg" alt=""  />
               </div>`;
          let decrement = divBtn.querySelector(".decrement");
          let increment = divBtn.querySelector(".increment");
          let value = divBtn.querySelector(".value");

          divBtn.classList.add(".btn1");
          image.classList.add("add");
          article.replaceChild(divBtn, btns);
          //quantity
          let quantity = 1;
          increment.addEventListener("click", () => {
            quantity++;
            value.textContent = quantity;
            this.updateCartItem(item, quantity);
            this.cartM();
          });

          decrement.addEventListener("click", () => {
            if (quantity > 1) {
              quantity--;
              value.textContent = quantity;
              this.updateCartItem(item, quantity);
              this.cartM();
            }
          });

          const id = e.currentTarget.getAttribute("data-id");

          const cartItem = goods.find((item) => {
            return item.name === id;
          });
          this.addToCart(cartItem);
          this.updateCartItem(cartItem, quantity);
        });
      });
      //updat cart and update

      let image = article.querySelector("img");
      this.main.appendChild(article);
    });
  }
  addToCart(item) {
    item.quantity = 1;
    this.cart.push(item);
    this.cartM();
  }

  updateCartItem(item, quantity) {
    this.cartM();
    item.quantity = quantity;
  }
  cartM() {
    this.footer.innerHTML = ""; // Clear the footer content first

    if (this.cart.length === 0) {
      this.footer.innerHTML = `
      <div class="box_box text-center grid justify-center">
        <img src="../assets/images/illustration-empty-cart.svg" alt="" />
        <p class="text-[10px] font-bold text-[#c9aea6]">
          Your added items will appear here
        </p>
      </div>`;
    } else {
      let totalQuantity = 0;
      let totalPrice = 0;

      this.cart.forEach((item) => {
        totalQuantity += item.quantity;
        totalPrice += item.price * item.quantity;

        this.icon.innerHTML = ` Your Cart (${totalQuantity})`;
        this.footer.innerHTML += `
        <div class="big">
          <div class="product">
            <h5 class="text-[15px]">${item.name}</h5>
            <div class="flex justify-between items-center border-b-2 pb-4">
              <div class="pricing mt-1 flex items-center gap-4">
                <p class="text-red-500 text-xl font-bold">${item.quantity}x</p>
                <p class="text-[#c9aea6] font-[400]">@${item.price.toFixed(
                  2
                )}</p>
                <p class="text-[#c9aea6] font-[900]">$${(
                  item.price * item.quantity
                ).toFixed(2)}</p>
              </div>
              <img data-name="${
                item.name
              }" src="../assets/images/icon-remove-item.svg" class="remove-item border-2 w-[1rem]" alt="Remove Item" />
            </div>
          </div>
        </div>`;
      });

      // Append the order total and confirm button at the end
      this.footer.innerHTML += `
      <div class="down mt-5">
        <div class="total flex justify-between">
          <p class="text-xl">Order Total</p>
          <p class="font-bold">$${totalPrice.toFixed(2)}</p>
        </div>
        <div class="w-full flex bg-[#f4edeb] md:p-4 p-2 rounded-lg justify-center gap-2 mt-5">
          <img src="../assets/images/icon-carbon-neutral.svg" alt="" />
          <p class="text-sm">This is a <span class="font-bold">Carbon-neutral</span> delivery</p>
        </div>
        <div class="btn3 mt-4">
          <div class="btn3_com bg-red-600 text-white font-bold p-4 text-center rounded-full">
            Confirm Order
          </div>
        </div>
      </div>`;

      // Add event listeners for remove buttons
      let removeButtons = this.footer.querySelectorAll(".remove-item");
      removeButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
          const itemName = e.currentTarget.getAttribute("data-name");
          this.removeFromCart(itemName);
        });
      });
    }
  }

  removeFromCart(itemName) {
    // Filter out the item with the matching name from the cart array
    this.cart = this.cart.filter((item) => item.name !== itemName);
    this.cartM(); // Re-render the cart after removing the item
  }
}
const seeing = new view();
seeing.fetch();
// Example manual call
seeing.cartM(seeing.cart);
