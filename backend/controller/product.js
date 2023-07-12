const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");

import { prisma } from "../generated/prisma-client";

const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// create product
router.post(
  "/create-product",
  catchAsyncErrors(async (req, res) => {
    const shopId = req.body.shopId;
    const shop = await prisma.shops.findById(shopId);
    if (!shop) {
      return res.status(400).json({
        success: false,
        message: "Shop Id is invalid!",
      });
    } else {
      let images = [];

      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }

      const imagesLinks = [];

      for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
          folder: "products",
        });

        imagesLinks.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }

      const productData = req.body;
      productData.images = imagesLinks;
      productData.shop = shop;

      const product = await prisma.products.create(productData);

      res.status(201).json({
        success: true,
        product,
      });
    }
  })
);

// get all products of a shop
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res) => {
    const products = await prisma.products.find({ shopId: req.params.id });

    res.status(201).json({
      success: true,
      products,
    });
  })
);

// delete product of a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res) => {
    const product = await prisma.products.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product is not found with this id",
      });
    }

    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await prisma.products.delete(product);

    res.status(201).json({
      success: true,
      message: "Product Deleted successfully!",
    });
  })
);

// get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res) => {
    const products = await prisma.products.find().sort({ createdAt: -1 });

    res.status(201).json({
      success: true,
      products,
    });
  })
);
// review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res) => {
    const { user, rating, comment, productId, orderId } = req.body;

    const product = await prisma.products.findById(productId);

    const review = {
      user,
      rating,
      comment,
      productId,
    };

    const isReviewed = product.reviews.find(
      (rev) => rev.user.id === req.user.id
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.id === req.user.id) {
          rev.rating = rating;
          rev.comment = comment;
          rev.user = user;
        }
      });
    } else {
      product.reviews.push(review);
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await prisma.products.update({
      id: productId,
      data: {
        reviews: product.reviews,
        ratings: product.ratings,
      },
    });

    await prisma.orders.update({
      id: orderId,
      data: {
        cart: {
          $set: {
            "$[elem].isReviewed": true,
          },
          where: {
            _id: {
              $in: product.reviews.map((rev) => rev.id),
            },
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Reviwed succesfully!",
    });
  })
);

// all products --- for admin
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res) => {
    const products = await prisma.products.find();

    res.status(201).json({
      success: true,
      products,
    });
  })
);

module.exports = router;
