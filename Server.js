const express = require("express")
const userRoutes = require("./Routes/User")
const employeeRoutes = require("./Routes/Employee")
const mongoose = require("mongoose")
const cors = require('cors');
require('dotenv').config();

const db_CONNECTION_STRING = "mongodb+srv://101381972:Cluster01%2F10%2F2001@cluster0.5vn99.mongodb.net/COMP3123_Assignment?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(db_CONNECTION_STRING).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error: ", err);
})

const app = express()

app.use(cors());

const SERVER_PORT = 3001

app.use(express.json())
app.use(express.urlencoded())


app.use("/api/v1", userRoutes)
app.use("/api/v1", employeeRoutes)

app.route("/")
    .get((req, res) => {
        res.send("<h1>This is our company</h1>")
    })

app.listen(SERVER_PORT, () =>{
    console.log(`Server running at http://localhost:${SERVER_PORT}/`)
})