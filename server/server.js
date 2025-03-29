import express from "express"
import cors from "cors"
import 'dotenv/config'
import connectDB from "./config/mongoDb.js"
import {clerkWebhooks} from "./controllers/webhooks.js"

//PORT
const PORT = process.env.PORT || 5000

//intialize express  
const app = express()

//connect to databse
await connectDB()

//middlewares
app.use(cors())



//default route
app.get("/",(req,res) => {
    res.send("API is Working")
})
app.post('/clerk', express.json() , clerkWebhooks)

app.listen(PORT,(req,res) => {
    console.log(`Server is running on ${PORT}`)
})