import dotenv from "dotenv"

import mongoose from "mongoose";
import express from "express";
import { connectDB } from "./db/index.js";

dotenv.config({path: './.env'})
const app =express();
// console.log(process.env.PORT)
connectDB();
// IIFE
// ;(async () => {
//     try {
//         await mongoose.connect(`${process.env.MongoDB_URL}/PrathamDB`)
//         app.on("error", (error)=>{
//             console.log("Error", error);
//             throw error;
//         })
//         app.listen(process.env.PORT, () =>{
//             console.log("Server started");
//         })
//     } catch (error) {
//         console.error("Error: ", error);
//         throw error
//     }
// })()