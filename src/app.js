const express = require('express')
const app = express();

app.use("/a", (req, res) => {
    res.send("hello a ");
})

app.use("/", (req, res) => {
    res.send("hello");
})

app.listen(5000, () => {
    console.log("running on port 5000...")
})