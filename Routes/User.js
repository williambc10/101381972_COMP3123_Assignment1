const express = require("express")
const User = require("../Models/User")
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
})

routes.post('/login', async (req, res) => {
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