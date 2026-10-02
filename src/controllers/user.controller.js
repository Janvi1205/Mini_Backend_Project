import asyncHandler from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js";
import uploadonCloudinary from "../utils/cloudinary.js";


const generateAccessAndRefreshToken=async (userId)=>{ //as we will be using this thing multiple time so we are creating this method!
    try {
        
       const user= await User.findById(userId);
       const accessToken =user.generateAccessToken();
       const refreshToken= user.generateRefreshToken();

       user.refreshToken=refreshToken //we give the accessToken/refreshtoken to the user but we also keep the refreshTOken in our db so that user dont have to login again and agian 
       await user.save({validateBeforeSave:false}) //means save these without validating as we have already done it 
       return{accessToken,refreshToken}
    
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

const loginUser=asyncHandler(async(req,res)=>{
    // take data form req.body 
    // validate using username or email 
    //find the user 
    //password chck 
    //if pass matches then generate the access token and  refresh token and send it to user 
    //send cookie 

    const {username,email,password}=req.body //abhi hume exactly nhi pata ki user ne kya kya bhja h frontenf se toh andaj se we are accepting thes!
    //now we want atleast one thing username or email so that we can validate so we will kepp a chck here
    if(!username||!email)
    {
        throw new Error("username or email is required")
    }

    //Now validating the user in the db 

    const user =await User.findOne({
        $or:[{username},{email}]  //we did these coz we wanted that it should chck ki username ya email se koi h ya nhi
    })                             //otherwise we would have just do User.findOne(email) if we only wanted to chck email registeres h ya nhi 
    
     if(!user)
     {
        throw new Error("User does not exist")
     }


    //password chcking time
    const isPassValid=await user.isPasswordCorrect(password)//we are using user instead of User coz user is the thing which i created so it has all the methos which i created in the user.model.js

    if(!isPassValid)
    {
        throw new Error("Password is incorrect")
    }

    //now genrate the access and refreshToken 
    const{accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);

})

export  {registerUser,loginUser};