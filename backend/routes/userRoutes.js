const express = require('express')
const { registerUser, authUser, allUsers } = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');


const router = express.Router()

router.post("/login", authUser);
//details will be sent in the HTTP messages body rather than the URL, therefore POST method is preferable.
router.route('/register').post(registerUser) 
//all what we type inside route('/') will be after the endpoint ('/auth/register')

router.route('/users').get(protect, allUsers) 

module.exports = router;