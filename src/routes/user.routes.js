import { Router } from "express";
import {registerUser} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";

const router=Router();//made the router 

router.route("/register").post(
    upload.fields([    //added  a multer middleware here as we want to upload the images also and for that multer helps us 
        {               //isiliye we want registerUser execute karne se pehle middleware multer se milte huye jao 
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser
) //yaha aa gaya control toh ab agar /api/v1/users iske baad we do /api/v1/users/register then registerUser call ho jayega 

export default router;