import { Schema } from "mongoose";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {

            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true,
            index: true //helps in searching fucntionality 
        },
        email: {

            type: String,
            required: true,
            unique: true,
            lowecase: true,
            trim: true,

        },
        fullname: {

            type: String,
            required: true,
            trim: true,
            index: true //helps in searching fucntionality 
        },

        avatar: {

            type: String, //cloudnary url
            required: true,

        },
        coverImage: {

            type: String, //cloudnary url
            required: true,

        },
        watchHistory: [ //it depends on video.model.js and continuous appending will be done so took array 
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],

        password: {
            type: String,
            required: [true, 'Password required']
        },
        referenceToken: {
            type: String
        }
    },
    {
        timestamps: true //stores createdAt and updatesAt automatically 
    }
)
userSchema.pre("save", async function (next) { //pre is a hook which is used to perform anything just before the fucntionality mentioned..like here save(which is a middleware ) is mentioned which means that before saving the user changed things it should run the function below!...
    //also we didnt use the arrow fucntion coz that doesent hold the reference this!

    if (!this.isModified("password")) //we are chcking agar password modified hua hai tabhi krna sab warna agar koi bas avatar change kr eya profile pic change kre tab mat run krna ye fucntion be faltu 
    {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10) //does the password encryption 
    next()

})

userSchema.methods.isPasswordCorrect = async function (password) //made this method so that we can check the pass from a bcrpted version 
{
    return await bcrypt.compare(password, this.password) //password is coming form the usr and this.password is the saved one 
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(       //this generates the token
        {
            _id: this._id, //these and below are the payload whihc means what to use while generating a token string
            email: this.email,
            fullname: this.fullname,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(       //this generates the token
        {
            _id: this._id, //as it is a refreshtoken whihc gets continuosly refreshed so it contains less info so only id is there
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User = mongoose.model("User", userSchema) // here we gave the name "User" but in the actual db it is saved as "users"
