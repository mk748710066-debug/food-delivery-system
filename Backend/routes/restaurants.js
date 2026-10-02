const express = require("express");
const db = require("../db");

const router = express.Router();

// Get all restaurants
router.get("/", async (req, res) => {
    try {
        const [restaurants] = await db.promise().query(
            "SELECT * FROM restaurants ORDER BY rating DESC"
        );

        res.json(restaurants);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Unable to fetch restaurants"
        });
    }
});

// Get restaurant by ID
router.get("/:id", async (req, res) => {
    try {
        const [restaurants] = await db.promise().query(
            "SELECT * FROM restaurants WHERE id = ?",
            [req.params.id]
        );

        if (restaurants.length === 0) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        res.json(restaurants[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;