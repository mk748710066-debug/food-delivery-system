const API = "/api";


/* =========================
   REGISTER
========================= */

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const name =
                document.getElementById("name").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const phone =
                document.getElementById("phone").value.trim();

            const address =
                document.getElementById("address").value.trim();

            const password =
                document.getElementById("password").value;

            const message =
                document.getElementById("registerMessage");

            if (!name || !email || !password) {

                message.innerHTML = `
                    <div class="message-error">
                        Please fill all required fields.
                    </div>
                `;

                return;
            }

            try {

                const response =
                    await fetch(
                        `${API}/auth/register`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                name,
                                email,
                                password,
                                phone,
                                address

                            })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    message.innerHTML = `
                        <div class="message-error">
                            ${data.message || "Registration failed"}
                        </div>
                    `;

                    return;
                }

                message.innerHTML = `
                    <div class="message-success">
                        🎉 Registration successful!
                        <br>
                        Redirecting to login...
                    </div>
                `;

                registerForm.reset();

                setTimeout(
                    function () {

                        window.location.href =
                            "login.html";

                    },
                    1500
                );

            } catch (error) {

                console.error(
                    "Register Error:",
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
   LOGIN
========================= */

const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const email =
                document.getElementById("email").value.trim();

            const password =
                document.getElementById("password").value;

            const message =
                document.getElementById("loginMessage");

            if (!email || !password) {

                message.innerHTML = `
                    <div class="message-error">
                        Please enter email and password.
                    </div>
                `;

                return;
            }

            try {

                const response =
                    await fetch(
                        `${API}/auth/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                email,
                                password

                            })
                        }
                    );

                const data =
                    await response.json();

                if (!response.ok) {

                    message.innerHTML = `
                        <div class="message-error">
                            ${data.message || "Login failed"}
                        </div>
                    `;

                    return;
                }

                localStorage.setItem(
                    "token",
                    data.token
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                message.innerHTML = `
                    <div class="message-success">
                        🎉 Login successful!
                        <br>
                        Redirecting...
                    </div>
                `;

                setTimeout(
                    function () {

                        window.location.href =
                            "index.html";

                    },
                    1000
                );

            } catch (error) {

                console.error(
                    "Login Error:",
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
   LOAD ORDERS
========================= */

async function loadOrders() {

    const container =
        document.getElementById("ordersList");

    if (!container) return;

    const userData =
        localStorage.getItem("user");

    if (!userData) {

        container.innerHTML = `
            <div class="message-error">
                Please login to view your orders.
            </div>
        `;

        return;
    }

    const user =
        JSON.parse(userData);

    try {

        const response =
            await fetch(
                `${API}/orders/user/${user.id}`
            );

        if (!response.ok) {
            throw new Error("Unable to load orders");
        }

        const orders =
            await response.json();

        container.innerHTML = "";

        if (orders.length === 0) {

            container.innerHTML = `
                <div class="loading">

                    <h2>
                        No orders yet 🛍️
                    </h2>

                    <p>
                        Start ordering delicious food!
                    </p>

                    <br>

                    <a href="index.html">

                        <button class="primary-btn">
                            Browse Food 🍴
                        </button>

                    </a>

                </div>
            `;

            return;
        }

        orders.forEach(order => {

            container.innerHTML += `

                <div class="order-card">

                    <h3>
                        Order #${order.id}
                    </h3>

                    <p>
                        📅
                        ${new Date(
                            order.created_at
                        ).toLocaleString()}
                    </p>

                    <p>
                        💰
                        Total:
                        <strong>
                            ₹${Number(
                                order.total_amount
                            ).toFixed(2)}
                        </strong>
                    </p>

                    <p>
                        📍
                        ${order.delivery_address}
                    </p>

                    <p>
                        💳
                        ${order.payment_method}
                    </p>

                    <span class="order-status">
                        ${order.order_status}
                    </span>

                </div>

            `;
        });

    } catch (error) {

        console.error(
            "Orders Error:",
            error
        );

        container.innerHTML = `
            <div class="message-error">
                Unable to load orders.
            </div>
        `;
    }
}


/* =========================
   PAGE LOAD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadOrders();

    }
);