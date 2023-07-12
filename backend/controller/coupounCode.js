import { prisma } from "../generated/prisma-client";

const router = express.Router();

// create coupon code
router.post("/create-coupon-code", isSeller, async (req, res) => {
  const { name, discount, quantity, shopId } = req.body;

  const couponCode = await prisma.couponCodes.create({
    data: {
      name,
      discount,
      quantity,
      shopId,
    },
  });

  res.status(201).json({
    success: true,
    couponCode,
  });
});

// get all coupons of a shop
router.get("/get-coupon/:id", isSeller, async (req, res) => {
  const id = req.params.id;

  const couponCodes = await prisma.couponCodes.findMany({
    where: {
      shopId: id,
    },
  });

  res.status(201).json({
    success: true,
    couponCodes,
  });
});

// delete coupon code of a shop
router.delete("/delete-coupon/:id", isSeller, async (req, res) => {
  const id = req.params.id;

  await prisma.couponCodes.delete({
    id,
  });

  res.status(201).json({
    success: true,
    message: "Coupon code deleted successfully!",
  });
});

// get coupon code value by its name
router.get("/get-coupon-value/:name", async (req, res) => {
  const name = req.params.name;

  const couponCode = await prisma.couponCodes.findOne({
    where: {
      name,
    },
  });

  res.status(200).json({
    success: true,
    couponCode,
  });
});

module.exports = router;
