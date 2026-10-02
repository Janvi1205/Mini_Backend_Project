
// this middleware which I made will just verify ki user hai ya nhi h
// This middleware checks whether the request is coming from an authenticated user or not.


import { jwt } from "jsonwebtoken";// We use jwt to verify whether the access token is valid or not.
import asyncHandler from "../utils/asyncHandler";
import { User } from "../models/user.model";//We need this to find the user in MongoDB using the _id stored inside the JWT.


export const verifyJWT=asyncHandler(async(req,res,next)=>{

    // First we try to get the accessToken from cookies.
    // req.cookies is available because we used cookie-parser in app.js.
    // If accessToken is not present in cookies,
    // then we check the Authorization header.
    // Authorization header usually looks like:
    // "Bearer eyJhbGciOiJI..."
    // .replace("Bearer ","") removes "Bearer " from the header
    // so that we get only the actual token.

    const Token=req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","")


    // If there is no accessToken in cookies
    // AND there is no token in the Authorization header,
    // then we don't know whether the user is authenticated.
    // Therefore, we reject the request.


    if(!Token)
    {
        // No token was provided by the user,
        // so we throw an error saying that authentication is required.

        throw new Error("Unauthorized request")
    }


    // jwt.verify() verifies whether the token is genuine and valid.
    // Token = the token we received from cookies/header.
    // If the token is valid, jwt.verify() returns the decoded data
    // that was stored inside the token.

    const decodedInfoOfToken=jwt.verify(Token,process.env.ACCESS_TOKEN_SECRET) //this will verify the token 


    // decodedInfoOfToken contains the information that we stored
    // inside the JWT when we created it.
    // One of that pieces of information is the user's _id.
    // We use that _id to find the actual user from MongoDB.
    // .select("-password -refreshToken")
    // means don't include password and refreshToken in the result.
    // We don't want sensitive information unnecessarily available.

    const user=await User.findById(decodedInfoOfToken?._id).select("-password -refreshToken")


    // Even if the JWT is valid,
    // we still check whether the user actually exists in our database.
    //
    // For example:
    // The user may have been deleted from MongoDB,
    // but an old valid token may still exist.

    if(!user)
    {
        // If no user was found with the ID from the token,
        // then the access token cannot be used for a valid user.

        throw new Error("Invalid access token")
    }
    
})

