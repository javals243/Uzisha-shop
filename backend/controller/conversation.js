const Conversation = require("../model/conversation");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const express = require("express");
const { isSeller, isAuthenticated } = require("../middleware/auth");
const router = express.Router();

// create a new conversation
router.post("/create-new-conversation", async (req, res) => {
  try {
    const { groupTitle, userId, sellerId } = req.body;

    const isConversationExist = await prisma.conversation.findOne({
      groupTitle,
    });

    if (isConversationExist) {
      const conversation = isConversationExist;
      res.status(201).json({
        success: true,
        conversation,
      });
    } else {
      const conversation = await prisma.conversations.create({
        data: {
          groupTitle,
          members: [userId, sellerId],
        },
      });

      res.status(201).json({
        success: true,
        conversation,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.response.message), 500);
  }
});

// get seller conversations
router.get("/get-all-conversation-seller/:id", async (req, res) => {
  const id = req.params.id;

  const conversations = await prisma.conversations.findMany({
    where: {
      members: {
        $in: [id],
      },
    },
    orderBy: {
      updatedAt: "desc",
      createdAt: "desc",
    },
  });

  res.status(201).json({
    success: true,
    conversations,
  });
});

// get user conversations
// get user conversations
router.get("/get-all-conversation-user/:id", async (req, res) => {
  const id = req.params.id;

  const conversations = await prisma.conversations.findMany({
    where: {
      members: {
        $in: [id],
      },
    },
    orderBy: {
      updatedAt: "desc",
      createdAt: "desc",
    },
  });

  res.status(201).json({
    success: true,
    conversations,
  });
});

// update the last message
// update the last message
router.put("/update-last-message/:id", async (req, res) => {
  const id = req.params.id;
  const { lastMessage, lastMessageId } = req.body;

  await prisma.conversations.update({
    id,
    data: {
      lastMessage,
      lastMessageId,
    },
  });

  res.status(201).json({
    success: true,
  });
});

module.exports = router;
