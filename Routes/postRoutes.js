const express = require('express');
const Postrouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Post = require('../Models/Post');
const { getAllPosts,addPost,updatePost,deletePost,displayAllPosts,searchPost} = require('../Controllers/PostController')
Postrouter.use(express.json());

Postrouter.get("/",getAllPosts);//With description
Postrouter.post("/add",addPost);
Postrouter.put("/update/:id",updatePost);
Postrouter.delete("/delete/:id",deletePost);
Postrouter.get("/allposts",displayAllPosts);//Without description



//Search Module

Postrouter.get("/search/:by/:id",searchPost);//Here :by is the criteria on which searched is based on and :id is criteria's defination
                                                    


module.exports = Postrouter;

