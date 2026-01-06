const express = require("express");
const { authMiddleware } = require("./auth_router");
const { Product } = require("../models/models");
const product_router = express.Router();

product_router.get("/products", async (req, res) => {
    const products = await Product.findAll();
    res.status(200).json(products);
});

product_router.get("/products/:id", async (req, res) => {
    const product = await Product.findByPk(req.params.id);
    res.status(200).json(product);
});


product_router.post("/products", authMiddleware, async (req, res) => {
    const role = req.user.role;
    if (role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    const product = await Product.create(req.body);
    res.status(201).json(product);
});


product_router.put("/products/:id", authMiddleware, async (req, res) => {
    const role = req.user.role;
    if (role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }

    try {
        const [updatedRows] = await Product.update(req.body, {
            where: { product_id: req.params.id }
        });

        if (updatedRows === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



product_router.delete("/products/:id", authMiddleware, async (req, res) => {
    const role = req.user.role;
    if (role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    const product = await Product.destroy({ where: { id: req.params.id } });
    res.status(200).json(product);
});


module.exports = { product_router };