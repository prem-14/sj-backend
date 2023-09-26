const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
        })
        if (conn.connection.host) {
            const castObjectId = mongoose.ObjectId.cast();
            mongoose.ObjectId.cast(v => v === null || v === '' ? v : castObjectId(v));
        }
        console.log(`Mongodb connected to ${conn.connection.host}`);
    } catch (error) {
        throw new Error(error.message)
    }

}

module.exports = connectDB