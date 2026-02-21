import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser';


const app = express();

const corsURL = process.env.CORS_URL

app.use(cors(
    {
        origin : corsURL,
        credentials : true
    }
));

app.use(express.json({limit : '16kb'}));

app.use(express.urlencoded({extended : true, limit : '16kb'}));

app.use(express.static("public"))

app.use(cookieParser());

//Routes

import userRoute from "./routes/user.routes.js"

app.use("/api/v1/user", userRoute);

export default app;