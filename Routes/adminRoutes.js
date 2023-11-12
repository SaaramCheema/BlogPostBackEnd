const express = require('express');
const adminRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const {retrieveAllProfiles,retrieveAllPosts,viewParticularPost} = require('../Controllers/AdminController');
const {  authorizeAdmin } = require('../Middleware/AuthorizeAdmin');
const {  authenticateUser } = require('../Middleware/AuthenticateUser');
adminRouter.use(express.json());


adminRouter.get('/viewAllProfiles',authorizeAdmin,retrieveAllProfiles);
//adminRouter.get('/viewAllProfiles',authenticateUser,retrieveAllProfiles);
adminRouter.get('/viewAllPosts',retrieveAllPosts);
adminRouter.get('/viewPost/:id',viewParticularPost);






module.exports = adminRouter;


