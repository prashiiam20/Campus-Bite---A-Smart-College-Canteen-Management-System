const express = require("express");
const payment_router = express.Router();
const { authMiddleware } = require("./auth_router");
const { Order, OrderItem, Payment, sequelize } = require("../models/models");

// for an order we have to create the payment and have the initial status as pending

payment_router.post("/payments", authMiddleware, async (req, res) => {
    const { order_id, amount, currency, payment_method } = req.body;
    const payment = await Payment.create({ order_id, amount, currency, payment_method, transaction_id: null, status: "pending" });
    res.status(200).json(payment);
});

payment_router.get("/payments/order/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const payment = await Payment.findOne({ where: { order_id: id } });
    res.status(200).json(payment);
});


payment_router.put("/payments/:id", authMiddleware, async (req, res) => {
    try {
      const { status } = req.body;
      const paymentId = req.params.id;
  
      // Find payment by id
      const payment = await Payment.findByPk(paymentId);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
  
      // Update payment status
      payment.status = status;
      await payment.save();
  
      // Also update corresponding order's payment_status
      const order = await Order.findByPk(payment.order_id);
      if (order) {
        order.payment_status = status;
        await order.save();
      }
  
      res.status(200).json({ message: "Payment and order payment status updated", payment });
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ message: "Failed to update payment status", error: error.message });
    }
  });
  
  
  

module.exports = { payment_router };

