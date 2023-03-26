const asyncHandler = require('express-async-handler');
const generateToken = require('../config/generateToken');
const User = require('../models/userModel')

const registerUser = asyncHandler (async (req, res) => {
    const {name, email, password, picture} = req.body;

    try {
    const checked = await User.signup(email, password, name);
    
    const user = await User.create({
      name, email, password, picture
    })
   
    res.status(200).json({user})
    } catch (error) {
      res.status(400).json(error.message)
    }
    
})

const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
  
    if (user && (await user.validation(password))) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
  });

  //get query from user
  //api/user?search
  const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search? {
      $or:[
        {name: {$regex: req.query.search, $options: 'i'}},
        {email: {$regex: req.query.search, $options: 'i'}},
      ]
    } : {};

    const users = await User.find(keyword).find(
      {
        _id: { $ne: req.user._id}
      }).select('name email picture') //include only this values of users, password will be omitted

    res.send(users)
  })

module.exports = {registerUser, authUser, allUsers}