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
const http = require('http');
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");
app.use(
    cors({
        origin: [
            "https://devconnect-6j77.onrender.com",
            "http://localhost:5173"
        ],
        credentials: true,
    })
);


app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)
app.use('/', chatRouter)

const server = http.createServer(app);
initializeSocket(server);

connectDB()
    .then(() => {
        console.log("Successfully connected to database!!");
        const PORT = process.env.PORT || 5000;
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}...`);
        });
    })
    .catch((err) => {
        console.error("Not connected to database");
    });
