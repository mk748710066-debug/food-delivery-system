const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();


// ================================
// MIDDLEWARE
// ================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


// ================================
// FRONTEND
// ================================

app.use(
    express.static(
        path.join(__dirname, "../frontend")
    )
);


// ================================
// API ROUTES
// ================================

const authRoutes =
    require("./routes/auth");

const restaurantRoutes =
    require("./routes/restaurants");

const foodRoutes =
    require("./routes/foods");

const orderRoutes =
    require("./routes/orders");


app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/restaurants",
    restaurantRoutes
);

app.use(
    "/api/foods",
    foodRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);


// ================================
// TEST API
// ================================

app.get("/api", (req, res) => {

    res.json({
        success: true,
        message: "🍔 Food Delivery API is running"
    });

});


// ================================
// HOME PAGE
// ================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "../frontend/index.html"
        )
    );

});


// ================================
// SERVER
// ================================

const PORT = 5000;

app.listen(PORT, () => {

    console.log("");
    console.log("================================");
    console.log("🍔 FOOD DELIVERY SERVER");
    console.log("================================");
    console.log(
        `🚀 Server: http://localhost:${PORT}`
    );
    console.log(
        `🌐 Website: http://localhost:${PORT}`
    );
    console.log("================================");
    console.log("");

});