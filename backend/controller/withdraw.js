const Shop = require("../model/shop");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const Withdraw = require("../model/withdraw");
const sendMail = require("../utils/sendMail");
const router = express.Router();

// create withdraw request --- only for seller

router.post("/create-withdraw-request", isSeller, async (req, res) => {
  try {
    const amount = req.body.amount;
    const seller = req.seller;

    const withdraw = await prisma.withdraw.create({
      sellerId: seller.id,
      amount,
    });

    const shop = await prisma.shop.findOne({
      id: seller.id,
    });

    shop.availableBalance = shop.availableBalance - amount;

    await prisma.shop.update({
      id: seller.id,
      availableBalance,
    });

    res.status(201).json({
      success: true,
      withdraw,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// get all withdraws --- admnin

// get all withdraw requests
router.get(
  "/get-all-withdraw-request",
  isAuthenticated,
  isAdmin("Admin"),
  async (req, res) => {
    try {
      const withdraws = await prisma.withdraw.findMany({
        orderBy: {
          createdAt: {
            descending: true,
          },
        },
      });

      res.status(201).json({
        success: true,
        withdraws,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// update withdraw request ---- admin
router.put(
  "/update-withdraw-request/:id",
  isAuthenticated,
  isAdmin("Admin"),
  async (req, res) => {
    const withdrawId = req.params.id;
    const sellerId = req.body.sellerId;
    const withdraw = await prisma.withdraw.update({
      id: withdrawId,
      data: {
        status: "succeed",
        updatedAt: new Date(),
      },
    });

    const seller = await prisma.shop.findOne({
      id: sellerId,
    });

    const transection = {
      _id: withdraw._id,
      amount: withdraw.amount,
      updatedAt: withdraw.updatedAt,
      status: withdraw.status,
    };

    // The `push` method was used to add the transaction to the seller's transactions array.
    seller.transections.push(transection);

    await prisma.shop.update({
      id: sellerId,
      transections: seller.transections,
    });

    // The `sendMail` function was used to send an email to the seller confirming their withdraw request.
    try {
      await sendMail({
        email: seller.email,
        subject: "Payment confirmation",
        message: `Hello ${seller.name}, Your withdraw request of <span class="math-inline">\{withdraw\.amount\}</span> is on the way. Delivery time depends on your bank's rules it usually takes 3days to 7days.`,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }

    res.status(201).json({
      success: true,
      withdraw,
    });
  }
);

module.exports = router;
