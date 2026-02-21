import dotenv from "dotenv"

import mongoose from "mongoose";
import express from "express";
import { connectDB } from "./db/index.js";
import app from "./app.js";

dotenv.config({path: '../.env'})
// console.log(process.env.PORT)


const PORT = process.env.PORT || 8000;

connectDB()
.then(() => {
    app.listen(PORT, ()=>{
        console.log(`Server Started at port : ${PORT}`);
    })
})
.catch((err) => {
    console.log("MongoDB Connection Failed, Error: ", err);
})

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