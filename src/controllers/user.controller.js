import asyncHandler from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";
import uploadonCloudinary from "../utils/cloudinary.js";

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

export default registerUser;