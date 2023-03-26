const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected: ${connect.connection.host}`.yellow.underline)
    } catch(error){
        console.log(`${error.message}`.red)
        process.exit()
    }
}

module.exports = connectDB;