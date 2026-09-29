import asyncHandler from "../utils/asyncHandler.js"

const registerUser=asyncHandler(async(req,res)=>{  //as we have already made the utility file so we are simply using it now 

    res.status(200).json({
        message:"ok"
    })

})

export default registerUser;