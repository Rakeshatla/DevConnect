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
app.use(cors({
    origin: "http://localhost:5173", credentials: true
}))
app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)
app.use('/', userRouter)



connectDB().then(() => {
    console.log("sucessfully connected to database!!");
    app.listen(5000, () => {
        console.log("running on port 5000...")
    })
}).catch((err) => {
    console.error("not connected to database");
});