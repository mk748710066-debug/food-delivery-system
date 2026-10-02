const API = "/api";

/* =========================
   LOAD RESTAURANTS
========================= */

async function loadRestaurants() {

    const container = document.getElementById("restaurants");

    if (!container) return;

    try {

        const response = await fetch(`${API}/restaurants`);

        if (!response.ok) {
            throw new Error("Failed to load restaurants");
        }

        const restaurants = await response.json();

        container.innerHTML = "";

        if (restaurants.length === 0) {
            container.innerHTML = `
                <div class="loading">
                    No restaurants available.
                </div>
            `;
            return;
        }

        restaurants.forEach(restaurant => {

            container.innerHTML += `
                <div class="card">

                    <img
                        src="${restaurant.image}"
                        alt="${restaurant.name}"
                    >

                    <div class="card-content">

                        <h3>${restaurant.name}</h3>

                        <p>
                            ${restaurant.description || ""}
                        </p>

                        <p class="rating">
                            ⭐ ${restaurant.rating}
                            &nbsp; • &nbsp;
                            ${restaurant.delivery_time} min
                        </p>

                        <p>
                            📍 ${restaurant.address || ""}
                        </p>

                        <button
                            class="primary-btn"
                            onclick="viewRestaurant(${restaurant.id})"
                        >
                            View Menu 🍴
                        </button>

                    </div>

                </div>
            `;
        });

    } catch (error) {

        console.error("Restaurant Error:", error);

        container.innerHTML = `
            <div class="message-error">
                Unable to load restaurants.
            </div>
        `;
    }
}


/* =========================
   LOAD FOODS
========================= */

async function loadFoods() {

    const container = document.getElementById("foods");

    if (!container) return;

    try {

        const response = await fetch(`${API}/foods`);

        if (!response.ok) {
            throw new Error("Failed to load foods");
        }

        const foods = await response.json();

        container.innerHTML = "";

        if (foods.length === 0) {

            container.innerHTML = `
                <div class="loading">
                    No food available.
                </div>
            `;

            return;
        }

        foods.forEach(food => {

            container.innerHTML += `
                <div class="card">

                    <img
                        src="${food.image}"
                        alt="${food.name}"
                    >

                    <div class="card-content">

                        <h3>${food.name}</h3>

                        <p>
                            ${food.description || ""}
                        </p>

                        <p>
                            🍽️ ${food.category || "Food"}
                        </p>

                        <div class="price">
                            ₹${Number(food.price).toFixed(2)}
                        </div>

                        <button
                            class="primary-btn"
                            onclick='addToCart(${JSON.stringify(food)})'
                        >
                            Add to Cart 🛒
                        </button>

                    </div>

                </div>
            `;
        });

    } catch (error) {

        console.error("Food Error:", error);

        container.innerHTML = `
            <div class="message-error">
                Unable to load food.
            </div>
        `;
    }
}


/* =========================
   RESTAURANT MENU
========================= */

async function loadRestaurantMenu() {

    const container =
        document.getElementById("restaurantFoods");

    const info =
        document.getElementById("restaurantInfo");

    if (!container) return;

    const params =
        new URLSearchParams(window.location.search);

    const restaurantId =
        params.get("id");

    if (!restaurantId) {

        container.innerHTML = `
            <div class="message-error">
                Restaurant not selected.
            </div>
        `;

        return;
    }

    try {

        const restaurantResponse =
            await fetch(
                `${API}/restaurants/${restaurantId}`
            );

        if (!restaurantResponse.ok) {
            throw new Error("Restaurant not found");
        }

        const restaurant =
            await restaurantResponse.json();

        if (info) {

            info.innerHTML = `
                <div class="restaurant-info">

                    <h1>${restaurant.name}</h1>

                    <p>
                        ${restaurant.description || ""}
                    </p>

                    <p>
                        ⭐ ${restaurant.rating}
                        &nbsp; • &nbsp;
                        ${restaurant.delivery_time} min
                    </p>

                    <p>
                        📍 ${restaurant.address || ""}
                    </p>

                </div>
            `;
        }

        const foodResponse =
            await fetch(
                `${API}/foods/restaurant/${restaurantId}`
            );

        if (!foodResponse.ok) {
            throw new Error("Menu not found");
        }

        const foods =
            await foodResponse.json();

        container.innerHTML = "";

        if (foods.length === 0) {

            container.innerHTML = `
                <div class="loading">
                    No food available.
                </div>
            `;

            return;
        }

        foods.forEach(food => {

            container.innerHTML += `
                <div class="card">

                    <img
                        src="${food.image}"
                        alt="${food.name}"
                    >

                    <div class="card-content">

                        <h3>${food.name}</h3>

                        <p>
                            ${food.description || ""}
                        </p>

                        <div class="price">
                            ₹${Number(food.price).toFixed(2)}
                        </div>

                        <button
                            class="primary-btn"
                            onclick='addToCart(${JSON.stringify(food)})'
                        >
                            Add to Cart 🛒
                        </button>

                    </div>

                </div>
            `;
        });

    } catch (error) {

        console.error(
            "Restaurant Menu Error:",
            error
        );

        container.innerHTML = `
            <div class="message-error">
                Unable to load restaurant menu.
            </div>
        `;
    }
}


/* =========================
   ADD TO CART
========================= */

function addToCart(food) {

    let cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    const existing =
        cart.find(item => item.id === food.id);

    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            id: food.id,

            restaurant_id:
                food.restaurant_id,

            name: food.name,

            description:
                food.description || "",

            price:
                Number(food.price),

            image:
                food.image,

            category:
                food.category || "",

            quantity: 1
        });
    }

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCartCount();

    alert(
        `${food.name} added to cart! 🛒`
    );
}


/* =========================
   CART COUNT
========================= */

function updateCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    const count =
        cart.reduce(
            (total, item) =>
                total + Number(item.quantity),
            0
        );

    const cartCount =
        document.getElementById("cartCount");

    if (cartCount) {
        cartCount.textContent = count;
    }
}


/* =========================
   VIEW RESTAURANT
========================= */

function viewRestaurant(id) {

    window.location.href =
        `restaurant.html?id=${id}`;
}


/* =========================
   SCROLL TO FOOD
========================= */

function scrollToFood() {

    const section =
        document.getElementById("food-section");

    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });
    }
}


/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.href =
        "index.html";
}


/* =========================
   PAGE LOAD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadRestaurants();

        loadFoods();

        loadRestaurantMenu();

        updateCartCount();

    }
);