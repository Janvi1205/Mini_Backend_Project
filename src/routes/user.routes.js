import { Router } from "express";
import {loginUser, LogoutUser, refreshAccessToken, registerUser} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

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


router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,LogoutUser); // here verifyJwt if the middleware i created
//whenever it will go to /logout it has to first got to verifyjwt and then it can run the logoutuser func

router.route("/refresh-token").post(refreshAccessToken)

export default router;