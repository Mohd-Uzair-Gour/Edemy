import mongoose from "mongoose"

//connect to the mongo db 

const connectDB = async() => {
    mongoose.connection.on('connected',() => console.log("Database is connected"))
    await mongoose.connect(`${process.env.MONGODB_URI}/Edemy`)
}

export default connectDB