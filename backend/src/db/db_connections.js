import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    //connect
    const connectionString = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    //log of connected
    console.log(
      `Connected to MONGO-DB !! : ${connectionString.connection.host}`
    );
    //log error
  } catch (error) {
    console.log("Error while connecting to MONGO-DB", error);
  }
};

export default connectDB;
