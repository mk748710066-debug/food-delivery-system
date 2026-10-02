const API = "/api";


/* =========================
   GET CART
========================= */

function getCart() {

    return JSON.parse(
        localStorage.getItem("cart")
    ) || [];
}


/* =========================
   SAVE CART
========================= */

function saveCart(cart) {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}


/* =========================
   DISPLAY CART
========================= */

function displayCart() {

    const container =
        document.getElementById("cartItems");

    const summary =
        document.getElementById("cartSummary");

    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {

        container.innerHTML = `

            <div class="loading">

                <h2>
                    Your cart is empty 🛒
                </h2>

                <p>
                    Add some delicious food!
                </p>

                <br>

                <a href="index.html">

                    <button class="primary-btn">
                        Browse Food 🍴
                    </button>

                </a>

            </div>
        `;

        if (summary) {
            summary.innerHTML = "";
        }

        return;
    }

    container.innerHTML = "";

    let total = 0;

    cart.forEach(
        (item, index) => {

            const itemTotal =
                Number(item.price) *
                Number(item.quantity);

            total += itemTotal;

            container.innerHTML += `

                <div class="cart-item">

                    <img
                        src="${item.image}"
                        alt="${item.name}"
                    >

                    <div class="cart-item-info">

                        <h3>
                            ${item.name}
                        </h3>

                        <p>
                            ₹${Number(
                                item.price
                            ).toFixed(2)}
                        </p>

                    </div>

                    <div class="quantity-controls">

                        <button
                            onclick="changeQuantity(${index}, -1)"
                        >
                            −
                        </button>

                        <strong>
                            ${item.quantity}
                        </strong>

                        <button
                            onclick="changeQuantity(${index}, 1)"
                        >
                            +
                        </button>

                    </div>

                    <strong>
                        ₹${itemTotal.toFixed(2)}
                    </strong>

                    <button
                        class="remove-btn"
                        onclick="removeItem(${index})"
                    >
                        Remove
                    </button>

                </div>

            `;
        }
    );

    if (summary) {

        summary.innerHTML = `

            <div class="cart-summary">

                <div class="cart-total">

                    Total:
                    ₹${total.toFixed(2)}

                </div>

                <button
                    class="primary-btn"
                    onclick="goToCheckout()"
                >
                    Proceed to Checkout →
                </button>

            </div>

        `;
    }
}


/* =========================
   CHANGE QUANTITY
========================= */

function changeQuantity(index, change) {

    const cart = getCart();

    if (!cart[index]) return;

    cart[index].quantity =
        Number(cart[index].quantity) +
        change;

    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);
    }

    saveCart(cart);

    displayCart();
}


/* =========================
   REMOVE ITEM
========================= */

function removeItem(index) {

    const cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);

    displayCart();
}


/* =========================
   CHECKOUT
========================= */

function goToCheckout() {

    const cart = getCart();

    if (cart.length === 0) {

        alert(
            "Your cart is empty."
        );

        return;
    }

    const user =
        localStorage.getItem("user");

    if (!user) {

        alert(
            "Please login before checkout."
        );

        window.location.href =
            "login.html";

        return;
    }

    window.location.href =
        "checkout.html";
}


/* =========================
   CHECKOUT SUMMARY
========================= */

function loadCheckout() {

    const summary =
        document.getElementById(
            "checkoutSummary"
        );

    if (!summary) return;

    const cart = getCart();

    if (cart.length === 0) {

        summary.innerHTML = `
            <div class="message-error">
                Your cart is empty.
            </div>
        `;

        return;
    }

    let total = 0;

    cart.forEach(item => {

        total +=
            Number(item.price) *
            Number(item.quantity);

    });

    summary.innerHTML = `

        <div class="checkout-summary">

            <h3>
                🧾 Order Summary
            </h3>

            <br>

            ${cart.map(item => `

                <p>
                    ${item.name}
                    × ${item.quantity}
                    =
                    ₹${(
                        Number(item.price) *
                        Number(item.quantity)
                    ).toFixed(2)}
                </p>

            `).join("")}

            <hr>

            <br>

            <h2>
                Total:
                ₹${total.toFixed(2)}
            </h2>

        </div>

    `;
}


/* =========================
   PLACE ORDER
========================= */

const checkoutForm =
    document.getElementById(
        "checkoutForm"
    );

if (checkoutForm) {

    checkoutForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const userData =
                localStorage.getItem("user");

            if (!userData) {

                alert(
                    "Please login first."
                );

                window.location.href =
                    "login.html";

                return;
            }

            const user =
                JSON.parse(userData);

            const cart = getCart();

            if (cart.length === 0) {

                alert(
                    "Your cart is empty."
                );

                return;
            }

            const deliveryAddress =
                document
                    .getElementById(
                        "deliveryAddress"
                    )
                    .value
                    .trim();

            const paymentMethod =
                document.getElementById(
                    "paymentMethod"
                ).value;

            const message =
                document.getElementById(
                    "checkoutMessage"
                );

            if (!deliveryAddress) {

                message.innerHTML = `
                    <div class="message-error">
                        Please enter delivery address.
                    </div>
                `;

                return;
            }

            try {

                const response =
                    await fetch(
                        `${API}/orders`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                user_id:
                                    user.id,

                                items:
                                    cart.map(
                                        item => ({
                                            food_id:
                                                item.id,

                                            quantity:
                                                Number(
                                                    item.quantity
                                                )
                                        })
                                    ),

                                delivery_address:
                                    deliveryAddress,

                                payment_method:
                                    paymentMethod

                            })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    message.innerHTML = `
                        <div class="message-error">
                            ${data.message || "Order failed"}
                        </div>
                    `;

                    return;
                }

                localStorage.removeItem(
                    "cart"
                );

                message.innerHTML = `

                    <div class="message-success">

                        🎉
                        <strong>
                            Order placed successfully!
                        </strong>

                        <br><br>

                        Order ID:
                        #${data.order.id}

                        <br>

                        Total:
                        ₹${Number(
                            data.order.total
                        ).toFixed(2)}

                    </div>

                `;

                setTimeout(
                    function () {

                        window.location.href =
                            "orders.html";

                    },
                    1800
                );

            } catch (error) {

                console.error(
                    "Order Error:",
                    error
                );

                message.innerHTML = `
                    <div class="message-error">
                        Server connection failed.
                    </div>
                `;
            }
        }
    );
}


/* =========================
   PAGE LOAD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayCart();

        loadCheckout();

    }
);