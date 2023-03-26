const express = require('express');
const { sendNotification, fetchNotification, removeNotification } = require('../controllers/notificationsController');
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()


router.route('/').post(protect, sendNotification) //create notifications
router.route('/').get(protect, fetchNotification) //fetch notifications
router.route('/remove').put(protect, removeNotification) //remove readen notification 

module.exports = router;