import asyncHandler from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";
import uploadonCloudinary from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async (userId) => { //as we will be using this thing multiple time so we are creating this method!
    try {

        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken //we give the accessToken/refreshtoken to the user but we also keep the refreshTOken in our db so that user dont have to login again and agian 
        await user.save({ validateBeforeSave: false }) //means save these without validating as we have already done it 
        return { accessToken, refreshToken }

    } catch (error) {
        throw new Error("Something went wrong while generating the token ")

    }
}
const registerUser = asyncHandler(async (req, res) => {  //as we have already made the utility file so we are simply using it now 

    //get user details from frontend
    //validate it..chck if anything empty or not 
    //chck if user already exist or not :username and email 
    //chck for image,chck for avatar
    //upload them to cloudinary,avatar
    //create user object.....create entry in db
    //remove password and refresh token field  from response 
    //chck for usr creation 
    //return res

    const { fullname, email, password, username } = req.body;//took the user details from the req came!
    console.log("Email:", email);

    if (fullname === "") {
        throw new Error("fullname is required");
    }

    if (email === "") {
        throw new Error("email is required");
    }

    if (password === "") {
        throw new Error("password is required");
    }

    if (username === "") {
        throw new Error("username is required");
    }


    //Vaidation
    const existeduser = await User.findOne({//using this User we can contact with the database and validate things  as it is connected to our db 
        $or: [{ username }, { email }]
    })

    if (existeduser) {
        throw new Error("user with this email or username already exist");


    }

    const avatarLocalAvatar = req.files?.avatar?.[0]?.path;//using this we can take the path of the file stree in our local server using multer 
    const coverImageLocalpath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalAvatar) {
        throw new Error("Avatar file is required")
    }



    //uploading on cloudinary

    const avatar = await uploadonCloudinary(avatarLocalAvatar);
    let coverImage;
    if (coverImageLocalpath) {
        coverImage = await uploadonCloudinary(coverImageLocalpath);
    }


    //creating user and uploading details on DB

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(//best way to chck if user is created or not 
        "-password -refreshToken"  //it means apart from these everything will come in the createdUser 
    )

    if (!createdUser) {
        throw new Error("Something went wrong while registering the user ")
    }

    //send response

    return res.status(201).json({ createdUser });
})

const loginUser = asyncHandler(async (req, res) => {
    // take data form req.body 
    // validate using username or email 
    //find the user 
    //password chck 
    //if pass matches then generate the access token and  refresh token and send it to user 
    //send cookie 

    const { username, email, password } = req.body //abhi hume exactly nhi pata ki user ne kya kya bhja h frontenf se toh andaj se we are accepting thes!
    //now we want atleast one thing username or email so that we can validate so we will kepp a chck here
    if (!(username || email)) {
        throw new Error("username or email is required")
    }

    //Now validating the user in the db 

    const user = await User.findOne({
        $or: [{ username }, { email }]  //we did these coz we wanted that it should chck ki username ya email se koi h ya nhi
    })                             //otherwise we would have just do User.findOne(email) if we only wanted to chck email registeres h ya nhi 

    if (!user) {
        throw new Error("User does not exist")
    }


    //password chcking time
    const isPassValid = await user.isPasswordCorrect(password)//we are using user instead of User coz user is the thing which i created so it has all the methos which i created in the user.model.js

    if (!isPassValid) {
        throw new Error("Password is incorrect")
    }

    //now genrate the access and refreshToken 
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken") //means send all the things to frontend  just dont send the things written in select

    //sending cookies
    const option = { //did this coz cookies can be modified from the frontend so if we dont want to do that and only want to be modified from server  
        httpOnly: true,
        secure: true

    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new apiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully"
            )
        )



})

const LogoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined

            }
        }

    )

    const option = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json(
            new apiResponse(
                200,
                {},
                "User logged Out "
            )
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => { //Created this so that sometime if the refrshtoken get expeired and shows loggedout  then automatically  front end dev can refresh the token and then can login instead of telling the user ot login again manually 

    //first take the refreshtoken from the cookie
    const incomingRefreshTokenFromUser = req.cookie.refreshToken || req.body.refreshToken //used this req.body also coz user might me usig mobile and seding req from there


    if (!incomingRefreshTokenFromUser) {
        throw new Error("Unauthorized user")
    }

    //now verify using jwt 

    const decodedToken = jwt.verify( //it need two thing 
        incomingRefreshTokenFromUser, //token comong from user 
        process.env.REFRESH_TOKEN_SECRET //actual token saved in the db 
    )

    //now as we have the refreshtoken with us so we have the user id also so using that we will see the info of the user from the db
    const user = await User.findById(decodedToken?._id)

    if (!user) {
        throw new Error("Invalid user")
    }

    //as we have the refresh token for each user also saved the db so we have to now chck if its matching witht the incoming token
    if (incomingRefreshTokenFromUser !== user?.referenceToken) {
        throw new Error("RefreshToken is expired or used")
    }

    const option = {
        httpOnly: true,
        secure: true
    }

    const { accessToken, newrefreshToken } = await generateAccessAndRefreshToken(user._id)

    return res.send(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", newrefreshToken, option)
        .json(
            new apiResponse(
                200,
                { accessToken, referenceToken: newrefreshToken },
                "Acess token refreshed "

            )
        )


})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    //now we dont have the headache of chcking or verifying the usr as we have the middleware verifyJWT for that 


    //first take the data from the user
    const { oldPassword, newPassword } = req.body
    //now we need the current user id 
    // as we are using the verifyjwt middleware so we have the user id in req.user._id
    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new Error("Invalid old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.send(200)
        .json(
            new apiResponse(
                200,
                {},
                "Password changed"
            )
        )

})

const getCurrentUser = asyncHandler(async (req, res) => {  //to get the current user
    res.send(200)
        .json(
            200,
            req.user  //as we already have the current user in the verifyjwt middleware 
        )
})


const updateAccountdetails = asyncHandler(async (req, res) => { //u can give access to user to  change whaterver u want 

    //first take the user details which u gave the access to change
    const { fullname, email } = req.body

    //now chck if the user gave the email or fullname 
    if (!email || !fullname) {
        throw new Error("All field are required")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname: fullname,
                email: email
            }

        },
        { new: true }

    ).select("-password")

    return res.send(200)
        .json(
            new apiResponse(
                200,
                user,
                "Account details updated "
            )
        )



})


//we could have added the change of avatar and coverimage in the above fucntion but we generally make seperate fucntion for changing that in production level 
const changeCoverImage = asyncHandler(async (req, res) => {

    //need to get the files from multer 
    const coverImageLocalpath = req.file?.path
    if (!coverImageLocalpath) {
        throw new Error("CoverImage is missing");
    }

    const coverImage = await uploadonCloudinary(coverImageLocalpath);
    if (!coverImage.url) {
        throw new Error("Cover image is missing ")

    }

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {new:true}

    ).select("-password")


})

const changeAvatarImage = asyncHandler(async (req, res) => {

    //need to get the files from multer 
    const AvatarLocalpath = req.file?.path
    if (!AvatarLocalpath) {
        throw new Error("Avatar is missing");
    }

    const Avatar = await uploadonCloudinary(AvatarLocalpath);
    if (!Avatar.url) {
        throw new Error("Avatar is missing ")

    }

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                Avatar:Avatar.url
            }
        },
        {new:true}

    ).select("-password")


})


export { registerUser, loginUser, LogoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountdetails,changeAvatarImage,changeCoverImage };