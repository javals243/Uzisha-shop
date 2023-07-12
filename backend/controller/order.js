const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const Order = require("../model/order");
const Shop = require("../model/shop");
const Product = require("../model/product");
import { prisma } from "../generated/prisma-client";

// create new order
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res) => {
    const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;

    //   group cart items by shopId
    const shopItemsMap = new Map();

    for (const item of cart) {
      const shopId = item.shopId;
      if (!shopItemsMap.has(shopId)) {
        shopItemsMap.set(shopId, []);
      }
      shopItemsMap.get(shopId).push(item);
    }

    // create an order for each shop
    const orders = [];

    for (const [shopId, items] of shopItemsMap) {
      const order = await prisma.orders.create({
        data: {
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        },
      });
      orders.push(order);
    }

    res.status(201).json({
      success: true,
      orders,
    });
  })
);
// get all orders of user
router.get(
  "/get-all-orders/:userId",
  catchAsyncErrors(async (req, res) => {
    const userId = req.params.userId;

    const orders = await prisma.orders.find({
      where: {
        user: { _id: userId },
      },
    });

    res.status(200).json({
      success: true,
      orders,
    });
  })
);

// get all orders of seller
router.get(
  "/get-seller-all-orders/:shopId",
  catchAsyncErrors(async (req, res) => {
    const shopId = req.params.shopId;

    const orders = await prisma.orders.find({
      where: {
        cart: { shopId: shopId },
      },
    });

    res.status(200).json({
      success: true,
      orders,
    });
  })
);

// update order status for seller
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncErrors(async (req, res) => {
    const id = req.params.id;
    const order = await prisma.orders.findById(id);

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Order not found with this id",
      });
    }

    order.status = req.body.status;

    if (req.body.status === "Delivered") {
      order.deliveredAt = new Date();
      order.paymentInfo.status = "Succeeded";
      const serviceCharge = order.totalPrice * 0.1;
      await updateSellerInfo(order.totalPrice - serviceCharge);
    }

    await order.save();

    res.status(200).json({
      success: true,
      order,
    });

    async function updateSellerInfo(amount) {
      const seller = await prisma.shops.findById(req.seller.id);

      seller.availableBalance = amount;

      await seller.save();
    }
  })
);
// give a refund ----- user
router.put(
  "/order-refund/:id",
  catchAsyncErrors(async (req, res) => {
    const id = req.params.id;
    const order = await prisma.orders.findById(id);

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Order not found with this id",
      });
    }

    order.status = req.body.status;

    await order.save();

    res.status(200).json({
      success: true,
      order,
      message: "Order Refund Request successfully!",
    });
  })
);

// accept the refund ---- seller
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncErrors(async (req, res) => {
    const id = req.params.id;
    const order = await prisma.orders.findById(id);

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Order not found with this id",
      });
    }

    order.status = req.body.status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order Refund successfull!",
    });

    if (req.body.status === "Refund Success") {
      const products = await prisma.products.findMany({
        where: {
          id: {
            in: order.cart.map((cartItem) => cartItem._id),
          },
        },
      });

      products.forEach(async (product) => {
        product.stock += product.quantity;
        product.sold_out -= product.quantity;

        await prisma.products.update({
          where: { _id: product._id },
          data: {
            stock: product.stock,
            sold_out: product.sold_out,
          },
        });
      });
    }
  })
);

// all orders --- for admin
router.get(
  "/admin-all-orders",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res) => {
    const orders = await prisma.orders.find();

    res.status(201).json({
      success: true,
      orders,
    });
  })
);

module.exports = router;
