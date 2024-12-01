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

routes.post('/login', async (req, res) => {
    console.log('Login Request:', req.body);

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        console.log('User Found:', user);
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password Match:', isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Generated Token:', token);

        res.status(200).json({ message: 'Login successful.', token });
    } catch (err) {
        console.log('Server Error:', err);

        res.status(500).json({ message: 'Server error.' });
    }
});

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