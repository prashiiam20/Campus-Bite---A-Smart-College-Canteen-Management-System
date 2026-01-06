const express = require("express");
const cart_router = express.Router();
const { authMiddleware } = require("./auth_router");
const { Cart, CartItem, Order, OrderItem, Product} = require("../models/models");

cart_router.get("/cart", authMiddleware, async (req, res) => {
    const cart = await Cart.findOne({ where: { user_id: req.user.user_id },
    include: [
      {
        model: CartItem,
        include: [Product],  // optional: eager load product info too
      },
    ],
 });
    res.status(200).json(cart);
});

cart_router.post("/cart", authMiddleware, async (req, res) => {
    const cart = await Cart.findOne({ where: { user_id: req.user.user_id } });
    if (cart) {
        return res.status(200).json(cart);
    }
    const new_cart = await Cart.create({ user_id: req.user.user_id });
    res.status(201).json(new_cart);
});


cart_router.post("/cart/add", authMiddleware, async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    // Find or create cart for user
    let cart = await Cart.findOne({ where: { user_id: req.user.user_id } });
    if (!cart) {
      cart = await Cart.create({ user_id: req.user.user_id });
    }

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock_quantity < quantity) {
      return res.status(400).json({ message: "Insufficient stock available" });
    }

    // Create CartItem
    const cart_item = await CartItem.create({
      cart_id: cart.cart_id,
      product_id,
      quantity,
      price: product.discounted_price,
    });

    product.stock_quantity -= quantity;
    await product.save();

    res.status(201).json(cart_item);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
});



cart_router.post("/cart/remove", authMiddleware, async (req, res) => {
    const { product_id } = req.body;
    const cart = await Cart.findOne({ where: { user_id: req.user.user_id } });
    const cart_item = await CartItem.findOne({ where: { cart_id: cart.cart_id, product_id } });
    if (!cart_item) {
    return res.status(404).json({ message: "Cart item not found" });
    }

    const product = await Product.findByPk(product_id);
    if (product) {
      // Restore stock
      product.stock_quantity += cart_item.quantity;
      await product.save();
    }
    await cart_item.destroy();
    res.status(200).json({ message: "Product removed from cart" });
});


cart_router.post("/cart/update", authMiddleware, async (req, res) => {
    const { cart_item_id, quantity } = req.body;
    const cart = await Cart.findOne({ where: { user_id: req.user.user_id } });
    if (!cart) return res.status(404).json({ message: "Cart not found" });
    const cart_item = await CartItem.findOne({ where: { cart_id: cart.cart_id } });
    if (!cart_item) return res.status(404).json({ message: "Cart item not found" });
    const product = await Product.findByPk(cart_item.product_id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const quantity_diff = quantity - cart_item.quantity;

    // If increasing quantity, check stock availability
    if (quantity_diff > 0) {
      if (product.stock_quantity < quantity_diff) {
        return res.status(400).json({ message: "Insufficient stock available" });
      }
      product.stock_quantity -= quantity_diff;
    } else {
      // If decreasing, restore stock
      product.stock_quantity += Math.abs(quantity_diff);
    }
    await product.save();

    cart_item.quantity = quantity;
    await cart_item.save();
    res.status(200).json(cart_item);
});


cart_router.post("/cart/checkout", authMiddleware, async (req, res) => {
  const { cart_id, payment_method, shipping_address } = req.body;

  const cart = await Cart.findByPk(cart_id, {
    include: [CartItem],
  });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  if (cart.CartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty. Add items before checkout." });
  }

  // Calculate total amount
  const total_amount = cart.CartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  // Create the order
  const order = await Order.create({
    user_id: req.user.user_id,
    total_amount,
    status: "placed",
    payment_method: payment_method || "COD",
    payment_status: "pending",
    shipping_address: shipping_address || "Default Address",
  });

  // Create order items
  for (const item of cart.CartItems) {
    await OrderItem.create({
      order_id: order.order_id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    });
  }

  // Clear the cart after checkout
  await CartItem.destroy({ where: { cart_id } });

  res.status(200).json({
    message: "Order placed successfully",
    order_id: order.order_id,
    total_amount,
  });
});



cart_router.post("/cart/clear", authMiddleware, async (req, res) => {
    const cart = await Cart.findOne({ where: { user_id: req.user.user_id } });
    const cart_items = await CartItem.findAll({ where: { cart_id: cart.cart_id } });
    for (const item of cart_items) {
    const product = await Product.findByPk(item.product_id);
    if (product) {
      product.stock_quantity += item.quantity;
      await product.save();
    }
    }
    await CartItem.destroy({ where: { cart_id: cart.cart_id } });
    res.status(200).json({ message: "Cart cleared" });
});



module.exports = { cart_router };
