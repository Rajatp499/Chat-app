const express = require('express')
const router = express.Router();
const { getMessages, unreadChat}= require('../controllers/messageController.js')


router.post('/get-messages', getMessages)
router.post('/unreadChat', unreadChat)

module.exports = router;