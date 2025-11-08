import mongoose from "mongoose";

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
    } catch (error) {
        console.log("Failed to connect to database: ", error);
    }
};

export default connectToDB;