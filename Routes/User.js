const express = require("express")
const User = require("../Models/User")

const routes = express.Router()

routes.get("/users", (req, res) => {
    //gets all books from MongoDB
    User.find().then((users) => {
        res.send(users)
    }).catch((err) => {
        res.status(500).send({message: err.message})
    })
    //res.send({message: "Get All Books"})
})

//Add NEW Book
routes.post("/signup", async (req, res) => {
    const userData = req.body //create a body for info because array is empty
    console.log(userData);
    try {
        //Create a new user instance
        const user = new User(userData)
        //Save the new user instance to MongoDB
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
      // Find the user by email or username
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