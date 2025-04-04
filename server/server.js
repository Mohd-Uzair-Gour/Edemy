import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./config/mongoDb.js"
import {clerkWebhooks, stripeWebhooks} from "./controllers/webhooks.js"
import educatorRouter from "./routes/educatorRoutes.js"
import { clerkMiddleware } from "@clerk/express"
import connectCloudinary from "./config/cloudinary.js"
import courseRouter from "./routes/courseRoutes.js"
import userRouter from "./routes/userRoutes.js"

//PORT
const PORT = process.env.PORT || 5000

//intialize express  
const app = express()

//connect to databse
await connectDB()
await connectCloudinary()

//middlewares
app.use(cors())
app.use(clerkMiddleware())

 

//default route
app.get("/",(req,res) => { res.send("API is Working")})
app.post('/clerk', express.json() , clerkWebhooks)
app.use('/api/educator',express.json(),educatorRouter)
app.use('/api/course',express.json(),courseRouter)
app.use('/api/user',express.json(),userRouter)
app.post('/stripe',express.raw({type:'application/json'}),stripeWebhooks)


app.listen(PORT,(req,res) => {
    console.log(`Server is running on ${PORT}`)
})