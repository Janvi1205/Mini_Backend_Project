import connectdb from "./db/db.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./.env"
});

connectdb()
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`server is running at port`)
    })
})
.catch((error)=>{
    console.log("Mongodb Connection failed",error);
})

