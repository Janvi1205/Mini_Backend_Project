import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectdb = async () => {
    try {
        const connectiontodb = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        ); 

        console.log(
            `MongoDB connected || DB_HOST=${connectiontodb.connection.host}`
        );

    } catch (error) {
        console.log("DB connect failed", error);
        process.exit(1);
    }
};

export default connectdb;