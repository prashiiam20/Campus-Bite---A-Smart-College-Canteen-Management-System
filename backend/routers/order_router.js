const express = require("express");
const order_router = express.Router();
const { authMiddleware } = require("./auth_router");
const { Order, OrderItem, Product } = require("../models/models");

order_router.get("/orders", authMiddleware, async (req, res) => {
  const role = req.user.role;

  if (role === "admin") {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [Product],
        },
      ],
    });
    return res.status(200).json(orders);
  }

  const orders = await Order.findAll({
    where: { user_id: req.user.user_id },
    include: [
      {
        model: OrderItem,
        include: [Product],
      },
    ],
  });

  res.status(200).json(orders);
});


order_router.get("/orders/:id", authMiddleware, async (req, res) => {
  try {
    const role = req.user.role;
    const orderId = req.params.id;

    let order;

    const includeClause = [
      {
        model: OrderItem,
        include: [
          {
            model: Product
          }
        ]
      }
    ];

    if (role === "admin") {
      // Admin can view any order
      order = await Order.findOne({
        where: { order_id: orderId },
        include: includeClause
      });
    } else if (role === "user") {
      // User can view only their own orders
      order = await Order.findOne({
        where: {
          order_id: orderId,
          user_id: req.user.user_id
        },
        include: includeClause
      });
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json(order);
    
  } catch (error) {
    console.error("Error fetching order details:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});



order_router.post('/orders', authMiddleware, async (req, res) => {
    const role = req.user.role;
    if (role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    const order = await Order.create(req.body);
    res.status(200).json(order);
});

order_router.put('/orders/:id', authMiddleware, async (req, res) => {
    const role = req.user.role;
    if (role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    const order = await Order.findByPk(req.params.id);
    order.update(req.body);
    res.status(200).json(order);

    if (role === "user") {
        const order = await Order.findByPk(req.params.id, { where: { user_id: req.user.id } });
        order.update(req.body);
        res.status(200).json(order);
    }
});


order_router.delete('/orders/:id', authMiddleware, async (req, res) => {
    const role = req.user.role;
    if (role !== "admin") {
        return res.status(403).json({ message: "Forbidden" });
    }
    const order = await Order.findByPk(req.params.id);
    await order.destroy();
    res.status(200).json({ message: "Order deleted" })
});


module.exports = { order_router };

