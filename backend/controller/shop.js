const express = require("express");
const path = require("path");
const router = express.Router();
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const Shop = require("../model/shop");
const { isAuthenticated, isSeller, isAdmin } = require("../middleware/auth");
const cloudinary = require("cloudinary");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const sendShopToken = require("../utils/shopToken");

import { prisma } from "../generated/prisma-client";

// create shop
router.post("/create-shop", async (req, res) => {
  const { name, email, password, avatar, address, phoneNumber, zipCode } =
    req.body;

  const seller = prisma.shop.create({
    name,
    email,
    password,
    avatar: {
      public_id: avatar,
      url: avatar,
    },
    address,
    phoneNumber,
    zipCode,
  });

  res.status(201).json({
    success: true,
    seller,
  });
});

// activate user
router.post("/activation", async (req, res) => {
  const { activation_token } = req.body;

  const seller = await prisma.shop.findOne({
    where: { activationToken: activation_token },
  });

  if (!seller) {
    res.status(400).json({
      error: "Invalid token",
    });
    return;
  }

  seller.activationToken = null;
  seller.save();

  res.status(201).json({
    success: true,
    seller,
  });
});

// login shop
router.post("/login-shop", async (req, res) => {
  const { email, password } = req.body;

  const seller = await prisma.shop.findOne({ where: { email: email } });

  if (!seller) {
    res.status(400).json({
      error: "User doesn't exists",
    });
    return;
  }

  if (!seller.comparePassword(password)) {
    res.status(400).json({
      error: "Invalid credentials",
    });
    return;
  }

  const token = prisma.auth.createToken(seller);

  res.status(201).json({
    success: true,
    token,
  });
});

// load shop
router.get("/getSeller", async (req, res) => {
  const seller = await prisma.shop.findById(req.params.id);

  if (!seller) {
    res.status(400).json({
      error: "User doesn't exists",
    });
    return;
  }

  res.status(200).json({
    success: true,
    seller,
  });
});

// update shop profile picture
router.put("/update-shop-avatar", async (req, res) => {
  const { imageId } = req.body;
  const seller = await prisma.shop.findById(req.seller._id);

  if (!seller) {
    res.status(400).json({
      error: "User doesn't exists",
    });
    return;
  }

  await prisma.shop.update({
    id: seller.id,
    avatar: {
      delete: true,
    },
  });

  await prisma.shop.update({
    id: seller.id,
    avatar: {
      public_id: imageId,
      url: imageId,
    },
  });

  res.status(200).json({
    success: true,
    seller,
  });
});

// update seller info
router.put("/update-seller-info", isSeller, async (req, res) => {
  const { name, description, address, phoneNumber, zipCode, imageId } =
    req.body;

  const seller = await prisma.shop.findOne({ id: req.seller._id });

  if (!seller) {
    res.status(400).json({
      error: "User not found",
    });
    return;
  }

  seller.name = name;
  seller.description = description;
  seller.address = address;
  seller.phoneNumber = phoneNumber;
  seller.zipCode = zipCode;

  if (imageId) {
    await prisma.shop.update({
      id: seller.id,
      avatar: {
        delete: true,
      },
    });

    await prisma.shop.update({
      id: seller.id,
      avatar: {
        public_id: imageId,
        url: imageId,
      },
    });
  }

  await seller.save();

  res.status(201).json({
    success: true,
    seller,
  });
});

// all sellers --- for admin
router.get(
  "/admin-all-sellers",
  isAuthenticated,
  isAdmin("Admin"),
  async (req, res) => {
    try {
      const sellers = await prisma.shop.findMany({
        orderBy: {
          createdAt: {
            direction: "desc",
          },
        },
      });
      res.status(201).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// delete seller ---admin
router.delete(
  "/delete-seller/:id",
  isAuthenticated,
  isAdmin("Admin"),
  async (req, res) => {
    try {
      const seller = await prisma.shop.findOne({ id: req.params.id });

      if (!seller) {
        return res.status(400).json({
          error: "Seller is not available with this id",
        });
      }

      await prisma.shop.delete({ id: req.params.id });

      res.status(201).json({
        success: true,
        message: "Seller deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// update seller withdraw methods --- sellers
router.put("/update-payment-methods", isSeller, async (req, res) => {
  try {
    const { withdrawMethod } = req.body;

    const seller = await prisma.shop.update({
      id: req.seller._id,
      withdrawMethod: withdrawMethod,
    });

    res.status(201).json({
      success: true,
      seller,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// delete seller withdraw merthods --- only seller
router.delete("/delete-withdraw-method/", isSeller, async (req, res) => {
  try {
    const seller = await prisma.shop.findOne({ id: req.seller._id });

    if (!seller) {
      return res.status(400).json({
        error: "Seller not found with this id",
      });
    }

    await prisma.shop.update({
      id: req.seller._id,
      withdrawMethod: null,
    });

    res.status(201).json({
      success: true,
      seller,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

module.exports = router;
