import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; //this we use so that from the server we can access the users cookies and perform CRUD on those cookies 

const app =express();
//we use .USE mthod to configure things like middleware etc
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credential:true
}));

app.use(express.json({limit:"16kb"})) //jab form se data aaye to wo handle krne ke liye this is used 

app.use(express.urlencoded({extended:true,limit:"16kb"})) // //jab url se data aaye to wo handle krne ke liye this is used 

app.use(express.static("public")) //to handle data whihc is stores in my public folder like img or smthing
app.use(cookieParser());

export default app;  