 const express = require("express");
const db = require("../db");

const router = express.Router();

// Get all foods
router.get("/", async (req, res) => {
    try {
        const [foods] = await db.promise().query(`
            SELECT 
                foods.*,
                restaurants.name AS restaurant_name
            FROM foods
            JOIN restaurants
                ON foods.restaurant_id = restaurants.id
            ORDER BY foods.id DESC
        `);

        res.json(foods);

    } catch (error) {
        console.error("Food fetch error:", error);

        res.status(500).json({
            message: "Unable to fetch food",
            error: error.message
        });
    }
});


// Get foods of a particular restaurant
router.get("/restaurant/:restaurantId", async (req, res) => {
    try {
        const [foods] = await db.promise().query(
            `
            SELECT *
            FROM foods
            WHERE restaurant_id = ?
            ORDER BY id DESC
            `,
            [req.params.restaurantId]
        );

        res.json(foods);

    } catch (error) {
        console.error("Restaurant food error:", error);

        res.status(500).json({
            message: "Unable to fetch restaurant menu",
            error: error.message
        });
    }
});


module.exports = router;