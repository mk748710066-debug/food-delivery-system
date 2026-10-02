 const express = require("express");
const db = require("../db");

const router = express.Router();


// ==========================================
// PLACE ORDER
// ==========================================
router.post("/", async (req, res) => {

    const connection = await db.promise().getConnection();

    try {

        const {
            user_id,
            items,
            delivery_address,
            payment_method
        } = req.body;


        // Validate order data
        if (
            !user_id ||
            !Array.isArray(items) ||
            items.length === 0 ||
            !delivery_address
        ) {
            return res.status(400).json({
                message: "Invalid order data"
            });
        }


        await connection.beginTransaction();


        let total = 0;
        const orderItems = [];


        // ==========================================
        // CHECK FOOD + CALCULATE TOTAL
        // ==========================================
        for (const item of items) {

            const foodId = Number(item.food_id);
            const quantity = Number(item.quantity);


            if (!foodId || !quantity || quantity <= 0) {
                throw new Error("Invalid food item or quantity");
            }


            // IMPORTANT:
            // available column is NOT used
            const [foods] = await connection.query(
                `SELECT id, price
                 FROM foods
                 WHERE id = ?`,
                [foodId]
            );


            if (foods.length === 0) {
                throw new Error(
                    `Food ${foodId} not found`
                );
            }


            const price = Number(foods[0].price);

            total += price * quantity;


            orderItems.push({
                food_id: foodId,
                quantity: quantity,
                price: price
            });
        }


        // ==========================================
        // CREATE ORDER
        // ==========================================
        const [orderResult] = await connection.query(
            `INSERT INTO orders
            (
                user_id,
                total_amount,
                delivery_address,
                payment_method,
                status
            )
            VALUES (?, ?, ?, ?, ?)`,
            [
                user_id,
                total,
                delivery_address,
                payment_method || "COD",
                "PLACED"
            ]
        );


        const orderId = orderResult.insertId;


        // ==========================================
        // INSERT ORDER ITEMS
        // ==========================================
        for (const item of orderItems) {

            await connection.query(
                `INSERT INTO order_items
                (
                    order_id,
                    food_id,
                    quantity,
                    price
                )
                VALUES (?, ?, ?, ?)`,
                [
                    orderId,
                    item.food_id,
                    item.quantity,
                    item.price
                ]
            );
        }


        // ==========================================
        // COMMIT
        // ==========================================
        await connection.commit();


        // ==========================================
        // SUCCESS RESPONSE
        // ==========================================
        res.status(201).json({
            message: "Order placed successfully",

            order: {
                id: orderId,
                total: total,
                status: "PLACED"
            }
        });


    } catch (error) {

        await connection.rollback();

        console.error("ORDER ERROR:", error);


        res.status(500).json({
            message: "Order failed",
            error: error.message
        });


    } finally {

        connection.release();

    }
});



// ==========================================
// GET USER ORDERS
// ==========================================
router.get("/user/:userId", async (req, res) => {

    try {

        const [orders] = await db.promise().query(
            `SELECT *
             FROM orders
             WHERE user_id = ?
             ORDER BY created_at DESC`,
            [req.params.userId]
        );


        res.json(orders);


    } catch (error) {

        console.error("GET ORDERS ERROR:", error);


        res.status(500).json({
            message: "Unable to fetch orders"
        });

    }
});



// ==========================================
// UPDATE ORDER STATUS
// ==========================================
router.put("/:id/status", async (req, res) => {

    try {

        const { status } = req.body;


        const allowedStatuses = [
            "PLACED",
            "CONFIRMED",
            "PREPARING",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "CANCELLED"
        ];


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                message: "Invalid status"
            });

        }


        // IMPORTANT:
        // orders table has "status", NOT "order_status"
        await db.promise().query(
            `UPDATE orders
             SET status = ?
             WHERE id = ?`,
            [
                status,
                req.params.id
            ]
        );


        res.json({
            message: "Order status updated"
        });


    } catch (error) {

        console.error("STATUS UPDATE ERROR:", error);


        res.status(500).json({
            message: "Server error"
        });

    }
});


module.exports = router;