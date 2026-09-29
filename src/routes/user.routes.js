import { Router } from "express";
import registerUser from "../controllers/user.controller.js";

const router=Router();//made the router 

router.route("/register").post(registerUser) //yaha aa gaya control toh ab agar /api/v1/users iske baad we do /api/v1/users/register then registerUser call ho jayega 

export default router;