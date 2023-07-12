const Messages = require("../model/messages");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const cloudinary = require("cloudinary");
const router = express.Router();

import { prisma } from "../generated/prisma-client";

// create event
router.post("/create-event", async (req, res) => {
  const { shopId, name, description, startDate, endDate, images } = req.body;

  const imagesLinks = [];

  for (const image of images) {
    const result = await prisma.cloudinary.upload(image, {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  const event = await prisma.events.create({
    data: {
      name,
      description,
      startDate,
      endDate,
      images,
      shopId,
    },
  });

  res.status(201).json({
    success: true,
    event,
  });
});

// get all events
router.get("/get-all-events", async (req, res) => {
  const events = await prisma.events.find();

  res.status(201).json({
    success: true,
    events,
  });
});

// get all events of a shop
router.get("/get-all-events/:id", async (req, res) => {
  const id = req.params.id;

  const events = await prisma.events.find({
    where: {
      shopId: id,
    },
  });

  res.status(201).json({
    success: true,
    events,
  });
});

// delete event of a shop
router.delete("/delete-shop-event/:id", async (req, res) => {
  const id = req.params.id;

  const event = await prisma.events.findById(id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event is not found with this id",
    });
  }

  for (const image of event.images) {
    await prisma.cloudinary.destroy(image.public_id);
  }

  await prisma.events.deleteById(id);

  res.status(201).json({
    success: true,
    message: "Event Deleted successfully!",
  });
});

// all events --- for admin
router.get(
  "/admin-all-events",
  isAuthenticated,
  isAdmin("Admin"),
  async (req, res) => {
    const events = await prisma.events.find();

    res.status(201).json({
      success: true,
      events,
    });
  }
);

module.exports = router;
