const User = require('../Models/User');
const Posts = require('../Models/Post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const retrieveAllProfiles = async (req, res) => {
    try {
        const users = await User.find();
        
        // Check if there are no users
        if (!users || users.length === 0) {
            return res.status(404).json({ message: 'No users found.' });
        }
        const profiles = users.map(user => {
            const { username, email } = user;
            return {
                username,
                email,
            };
        });
        res.status(200).json(profiles);
    }    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving user profile.' });
    }
};


const retrieveAllPosts = async (req, res) => {
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

const viewParticularPost = async (req, res) => {
    const postID=req.params.id;
    try {
        const post = await Posts.findById(postID);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        res.status(201).json({post});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unexpected Error.' });
    }
};
module.exports = {
    retrieveAllProfiles,
    retrieveAllPosts,
    viewParticularPost
}