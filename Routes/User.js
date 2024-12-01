const express = require("express")
const User = require("../Models/User")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { check, validationResult } = require('express-validator');

const routes = express.Router()

routes.get("/users", (req, res) => {
    User.find().then((users) => {
        res.send(users)
    }).catch((err) => {
        res.status(500).send({message: err.message})
    })
})

routes.post("/signup", [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { username, email, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/*routes.post("/signup", [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail()
    ], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
        
    const userData = req.body
    console.log(userData);
    try {
        const user = new User(userData)
        const newUser = await user.save()
        res.status(201).json({
            message: 'User created successfully.',
            user_id: newUser._id
          });
    } catch (err) {
        res.status(500).send({message: err.message})
    }
})*/

routes.post('/login', async (req, res) => {
    // Debugging: Log the request payload
    console.log('Login Request:', req.body);

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        // Debugging: Log if user is found or not
        console.log('User Found:', user);
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        // Debugging: Log the result of the password comparison
        console.log('Password Match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        // Debugging: Log the generated token
        console.log('Generated Token:', token);

        res.status(200).json({ message: 'Login successful.', token });
    } catch (err) {
        // Debugging: Log any server errors
        console.log('Server Error:', err);

        res.status(500).json({ message: 'Server error.' });
    }
});
/*routes.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(400).json({ status: false, message: 'Invalid email or password.' });
      }
      if (password !== user.password) {
        return res.status(400).json({ status: false, message: 'Invalid email or password.' });
      }
      res.status(200).json({ message: 'Login successful.'});
      
    } catch (err) {
      res.status(500).json({ status: false, message: 'Server error.' });
    }
});*/

routes.delete("/user/:userid", (req, res) => {
    User.findByIdAndDelete(req.params.userid).then((user) => {
        if(user) {
            res.send(user)
        } else {
            res.status(404).send({message: "User not found"})
        }
    }).catch((err) => {
        res.status(500).send({message: err.message})
    })
})

module.exports = routes