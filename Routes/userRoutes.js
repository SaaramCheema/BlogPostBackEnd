const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const { userLogin,userRegistration,retrieveUserProfile,updateUserProfile,followBlogger,getFeed} = require('../Controllers/UserController')
router.use(express.json());

//Test
router.get("/", (req, res) => {
    res.send("Hello from user route!");
});
//User registration
router.post('/register',userRegistration);
//User login
router.post('/login',userLogin);
//Get user profile 
router.get('/profile/:id',retrieveUserProfile);
//Update user profile
router.put('/update/:id', updateUserProfile);

//User Interaction
router.post("/follow/:id",followBlogger);// -->/:id is accountID for user who want to follow any blogger,BloggerID
                                        //to be provided inside postman body
router.get("/feed/:id",getFeed);    //Show feed of user with id passed through endpoint

module.exports = router;
