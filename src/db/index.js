import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // console.log(`${process.env.MongoDB_URL}`);
    const connectionInstance = await mongoose.connect(`${process.env.MongoDB_URL}/PrathamDB`);
    console.log(`MongoDB connected at ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("Error: ", error);
    process.exit(1) // Provided by Node
  }
};
