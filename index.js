import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { router } from './router/index.js'
import errorMiddleware from './middleware/error-middleware.js'


dotenv.config()


const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    // origin: [process.env.CLIENT_URL, process.env.VERCEL_CLIENT_URL, process.env.CLIENT_BUILD_URL]
}))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Origin', process.env.VERCEL_CLIENT_URL);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/api', router)
app.use(errorMiddleware)

const PORT = process.env.PORT || 8080


const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
    } catch (error) {
        console.log(error)
    }
}

start()

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
})