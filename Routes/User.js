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
routes.post("/user", async (req, res) => {
    const userData = req.body //create a body for info because array is empty
    console.log(userData);
    try {
        //Create a new user instance
        const user = new User(userData)
        //Save the new user instance to MongoDB
        const newUser = await user.save()
        res.send(newUser)
    } catch (err) {
        res.status(500).send({message: err.message})
    }
    //res.send({message: "Add NEW Book"})
})

module.exports = routes