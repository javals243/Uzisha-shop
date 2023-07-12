const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
import { prisma } from "../generated/prisma-client";

const express = require("express");

const catchAsyncErrors = require("../middleware/catchAsyncErrors");

router.post(
  "/process",
  catchAsyncErrors(async (req, res) => {
    const paymentIntent = await prisma.paymentIntents.create({
      amount: req.body.amount,
      currency: "INR",
      metadata: {
        company: "Becodemy",
      },
    });
    res.status(200).json({
      success: true,
      client_secret: paymentIntent.clientSecret,
    });
  })
);

router.get(
  "/stripeapikey",
  catchAsyncErrors(async (req, res) => {
    res.status(200).json({ stripeApikey: process.env.STRIPE_API_KEY });
  })
);

module.exports = router;
