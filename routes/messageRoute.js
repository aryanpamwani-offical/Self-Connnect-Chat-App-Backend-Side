const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../Controller/messageController");
const { authMiddleware } = require("../Middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(authMiddleware, allMessages);
router.route("/").post(authMiddleware, sendMessage);

module.exports = router;