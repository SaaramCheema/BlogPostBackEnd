const User = require('../Models/User');
const Posts = require('../Models/Post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');




const userLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Authentication failed. User not found.' });
        }

        // Compare the provided password with the stored hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Authentication failed. Wrong password.' });
        }

        // Create a JWT token for the user
        const token = jwt.sign({ username: user.username, roles: user.roles }, 'your-secret-key', { expiresIn: '1h' });

        res.status(200).json({message: 'Login successful,Token: '+token});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Login failed.' });
    }
};
const userRegistration = async (req, res) => {
    try {
        const { username, email, password,roles } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this username or email already exists.' });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            roles,
            posts:[],
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Registration failed.' });
    }
}


const retrieveUserProfile = async (req, res) => {
    try {
        const userId = req.params.id; 
        const user = await User.findById(userId).populate('posts');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const {username,email,posts}=user;
        res.status(200).json({
            username,
            email,
            posts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error retrieving user profile.' });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.params.id; 
        const {username,email} = req.body;

        // Update user by ID
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, email},
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({
            username:updatedUser.username,
            email:updatedUser.email,
            message: 'User profile updated successfully.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user profile.' });
    }
};

const followBlogger  = async (req, res) => {
    try {
        const toFollowId = req.params.id;
        const {username,email} = req.body; //of follower
        const follower = await User.findOne({ username, email });
       if (!follower) {
        return res.status(404).json({ message: 'Follower not found.' });
    }
       const toFollow = await User.findById(toFollowId);

       if (!toFollow) {
           return res.status(404).json({ message: 'Blogger not found.' });
       }
       const session = await mongoose.startSession();
       session.startTransaction();

       try {
           follower.following.push(toFollow);
           await follower.save();

           await session.commitTransaction();
           session.endSession();

           res.status(201).json({ message: 'Followed blogger.' });
       } catch (error) {
           await session.abortTransaction();
           session.endSession();
           console.error(error);
           res.status(500).json({ message: 'Follow failed.' });
       }
   } catch (error) {
       console.error(error);
       res.status(500).json({ message: 'Follow failed.' });
   }
}

const getFeed = async (req, res) => {
    const userId = req.params.id; 
    let posts;

    try {
        // Fetch the list of users the current user is following
        const currentUser = await User.findById(userId).populate('following', 'posts');

        if (!currentUser) {
            return res.status(404).json({ message: 'User not found!' });
        }
        const followingPosts = currentUser.following.reduce((acc, user) => {
            return acc.concat(user.posts);
        }, []);

        // Fetch the actual posts using the post IDs
        posts = await Posts.find({_id:{$in:followingPosts}});

        if (!posts || posts.length === 0) {
            return res.status(404).json({ message: 'No posts from followers to show!' });
        }

        return res.status(200).json({ posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unexpected failure.' });
    }
};



module.exports = {
    userLogin,
    userRegistration,
    retrieveUserProfile,
    updateUserProfile,
    followBlogger,
    getFeed
}