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

//router importing
import userRouter from "./routes/user.routes.js"

//routes declaration
//prev we used to simply write app.get(..) or app.post(..) but now we cant do that as we are importing routes and here eveything is not at one place 
app.use("/api/v1/users",userRouter) //means when we search /api/v1/user then transfer the control to userRouter which is in the user.routes.js


export default app;  