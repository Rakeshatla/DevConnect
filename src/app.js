require("dotenv").config()
const express = require('express')
const connectDB = require('./config/database')
const cookieParser = require('cookie-parser')
const app = express();
app.use(express.json());
app.use(cookieParser())
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const requestRouter = require('./routes/request')
const userRouter = require('./routes/user')
const cors = require('cors')
app.use(
    cors({
        origin: [
            "https://devsphere-ui.onrender.com",
            "http://localhost:5173"
        ],
        credentials: true,
    })
);


app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)



connectDB()
    .then(() => {
        console.log("Successfully connected to database!!");
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}...`);
        });
    })
    .catch((err) => {
        console.error("Not connected to database");
    });
