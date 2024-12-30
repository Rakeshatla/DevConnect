const express = require('express')
const connectDB = require('./config/database')
const User = require('./models/user')
const app = express();
app.use(express.json());

app.post('/signup', async (req, res) => {

    const user = new User(req.body);
    try {
        await user.save();
        res.send("successfully saved");
    }
    catch (err) {
        res.status(404).send("can't send")
    }
})

//get for one
app.get("/user", async (req, res) => {
    const userId = req.body.userId
    try {
        const users = await User.find({ _id: userId })
        if (users) {
            res.send(users)
        } else {
            res.status(404).send("problem for fetching");
        }
    } catch (err) {
        console.log("error")
    }
})

//feed api
app.get("/feed", async (req, res) => {
    // const userId = req.body.userId
    try {
        const users = await User.find({})
        if (users) {
            res.send(users)
        } else {
            res.status(404).send("problem for fetching");
        }
    } catch (err) {
        console.log("error")
    }
})

//delete user
app.delete("/user", async (req, res) => {
    const userId = req.body.userId
    try {
        await User.findByIdAndDelete({ _id: userId })
        res.send("successfully deleted")
    } catch (err) {
        console.log("error")
    }
})

//to update
app.patch("/user", async (req, res) => {
    const userId = req.body.userId
    const data = req.body
    try {
        await User.findByIdAndUpdate({ _id: userId }, data)
        res.send("successfully updated")
    } catch (err) {
        console.log("error")
    }
})

connectDB().then(() => {
    console.log("sucessfully connected to database!!");
    app.listen(5000, () => {
        console.log("running on port 5000...")
    })
}).catch((err) => {
    console.error("not connected to database");
});
