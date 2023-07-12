const express = require("express");
const User = require("../model/user");
const router = express.Router();
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendMail");
const sendToken = require("../utils/jwtToken");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// create user
router.post("/create-user", async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    const user = prisma.user.create({
      name,
      email,
      password,
      avatar: avatar,
    });

    res.status(201).json({
      success: true,
      message: `please check your email:- ${user.email} to activate your account!`,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// create activation token
const createActivationToken = (user) => {
  const token = prisma.user.generateActivationToken(user);
  return token;
};

// activation
router.post("/activation", async (req, res) => {
  try {
    const activationToken = req.body.activationToken;

    const user = prisma.user.findOne({
      where: {
        activationToken: activationToken,
      },
    });

    if (!user) {
      return res.status(400).json({
        error: "Invalid token",
      });
    }

    user.active = true;
    await prisma.user.update({
      id: user.id,
      active: true,
    });

    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// login user
router.post("/login-user", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Please provide the all fields!",
      });
    }

    const user = await prisma.user.findOne({
      where: {
        email: email,
      },
      select: {
        password: true,
      },
    });

    if (!user) {
      return res.status(400).json({
        error: "User doesn't exists!",
      });
    }

    const isPasswordValid = await prisma.user.verifyPassword(user, password);

    if (!isPasswordValid) {
      return res.status(400).json({
        error: "Please provide the correct information",
      });
    }

    sendToken(user, 201, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// load user
// get user
router.get("/getuser", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findOne({
      id: userId,
    });

    if (!user) {
      return res.status(400).json({
        error: "User doesn't exists",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// log out user
// logout
router.get("/logout", async (req, res) => {
  try {
    // Delete the token cookie
    res.cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    // Invalidate the user's session
    await prisma.user.update({
      id: req.user.id,
      sessionToken: null,
    });

    res.status(201).json({
      success: true,
      message: "Log out successful!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// update user info
// update user info
router.put("/update-user-info", isAuthenticated, async (req, res) => {
  try {
    const { email, password, phoneNumber, name } = req.body;

    const userId = req.user.id;
    const user = await prisma.user.update({
      id: userId,
      name: name,
      email: email,
      phoneNumber: phoneNumber,
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
// update user avatar
// update avatar
router.put("/update-avatar", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findOne({
      id: userId,
    });

    if (req.body.avatar !== "") {
      // Delete the old avatar
      const imageId = user.avatar.public_id;
      await prisma.file.delete({
        id: imageId,
      });

      // Upload the new avatar
      const myCloud = await prisma.file.create({
        data: req.body.avatar,
        folder: "avatars",
        width: 150,
      });

      user.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    await prisma.user.update({
      id: userId,
      avatar: user.avatar,
    });

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// update user addresses
// update user addresses
router.put("/update-user-addresses", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findOne({
      id: userId,
    });

    // Check if the address type already exists
    const sameTypeAddress = user.addresses.find(
      (address) => address.addressType === req.body.addressType
    );
    if (sameTypeAddress) {
      return res.status(400).json({
        error: `${req.body.addressType} address already exists`,
      });
    }

    // Check if the address already exists
    const existsAddress = user.addresses.find(
      (address) => address.id === req.body._id
    );

    if (existsAddress) {
      // Update the existing address
      await prisma.user.update({
        id: userId,
        addresses: {
          update: {
            id: existsAddress.id,
            data: req.body,
          },
        },
      });
    } else {
      // Create a new address
      await prisma.user.update({
        id: userId,
        addresses: {
          push: req.body,
        },
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// delete user address
// delete user address
router.delete("/delete-user-address/:id", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    await prisma.user.update({
      id: userId,
      addresses: {
        $pull: {
          id: addressId,
        },
      },
    });

    const user = await prisma.user.findOne({
      id: userId,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
// update user password
// update user password
router.put("/update-user-password", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;

    const user = await prisma.user.findOne({
      id: userId,
    });

    const isPasswordMatched = await prisma.user.verifyPassword(
      user,
      oldPassword
    );

    if (!isPasswordMatched) {
      return res.status(400).json({
        error: "Old password is incorrect!",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: "Password doesn't matched with each other!",
      });
    }

    await prisma.user.update({
      id: userId,
      password: newPassword,
    });

    res.status(200).json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// find user infoormation with the userId
// user info
router.get("/user-info/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await prisma.user.findOne({
      id: userId,
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// all users --- for admin
// admin all users
router.get(
  "/admin-all-users",
  isAuthenticated,
  isAdmin("Admin"),
  async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        orderBy: {
          createdAt: {
            descending: true,
          },
        },
      });

      res.status(201).json({
        success: true,
        users,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
// delete users --- admin
// delete user
router.delete(
  "/delete-user/:id",
  isAuthenticated,
  isAdmin("Admin"),
  async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await prisma.user.findOne({
        id: userId,
      });

      if (!user) {
        return res.status(400).json({
          error: "User is not available with this id",
        });
      }

      // Delete the user's avatar
      const imageId = user.avatar.public_id;
      await prisma.file.delete({
        id: imageId,
      });

      // Delete the user
      await prisma.user.delete({
        id: userId,
      });

      res.status(201).json({
        success: true,
        message: "User deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

module.exports = router;
