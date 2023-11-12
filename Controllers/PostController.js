const Posts = require('../Models/Post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');
const mongoose = require('mongoose');

const getAllPosts = async (req, res) => {
    let posts;
    try {
        posts = await Posts.find();

        if (!posts) {
            return res.status(404).json({ message: 'No posts to show!' });
        }
        return res.status(200).json({posts});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unexpected failure.' });
    }
};
const addPost = async (req, res) => {
    try {
        const { title, description,category,image,user } = req.body;
        let prevUser;
        try {
            prevUser = await User.findById(user);
        }
        catch(err){
            console.log(err);
        }
        const newPost = new Posts({title,description,category,image,user});
        const addmorePost = await mongoose.startSession();
        addmorePost.startTransaction();
        await newPost.save();
        prevUser.posts.push(newPost);
        await prevUser.save();
        await addmorePost.commitTransaction();
        addmorePost.endSession();
        res.status(201).json({ message: 'Post added successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Post addition failed.' });
    }
};
const updatePost = async (req, res) => {
    const { title,category,description }=req.body;
    const postID=req.params.id;
    let uptPost;

    try {
        const post = await Posts.findById(postID);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
      /*  if (post.owner !== req.user._id) {
            return res.status(403).json({ message: 'You are not the owner of this post.' });
        }*/
        uptPost = await Posts.findByIdAndUpdate(postID,{
            title,
            category,
            description
        })
        res.status(201).json({uptPost});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Post updation failed.' });
    }
};
const deletePost = async (req, res) => {
    const postID=req.params.id;
    let deletedPost;
    try {
        const post = await Posts.findById(postID);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }
      /*  if (post.owner !== req.user._id) {
            return res.status(403).json({ message: 'You are not the owner of this post.' });
        }*/
        deletedPost = await Posts.findOneAndDelete({ _id: postID }).populate('user');
        await deletedPost.user.posts.pull(deletedPost);
        await deletedPost.user.save();
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found.' });
        }
        res.status(201).json({message:"Post deleted successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Post deletion failed.' });
    }
};
const displayAllPosts = async (req, res) => {
    try {
       const allPostTitles = await Posts.find({}, 'title');
       res.status(200).json({ allPosts: allPostTitles.map(post => post.title)});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch posts.' });
    }
};


const searchPost = async (req, res) => {
    const { by, id } = req.params;

    try {
        let query;

        switch (by) {
            case 'keyword':
                query = { $text: { $search: id } };
                break;
            case 'category':
                query = { category: id };
                break;
            case 'author':
                query = { user: id };
                break;
            default:
                return res.status(400).json({ message: 'Invalid search criteria.' });
        }

        const posts = await Posts.find(query);

        res.status(200).json({ posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to perform the search.' });
    }
};

module.exports = {
    getAllPosts,
    addPost,
    updatePost,
    deletePost,
    displayAllPosts,
    searchPost
}