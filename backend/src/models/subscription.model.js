import mongoose, { Schema } from "mongoose";

const subscriptionModel=new Schema(
    {
        subscriber:{
            type:Schema.Types.ObjectId,//the one who is subscribing
            ref:"User"
        },

        channel:{
            type:Schema.Types.ObjectId,//the one whose channel is being subscribed
        }

    },
    {
        timestamps:true
    }
    
)

export const subscription=mongoose.model("subscription",subscriptionModel);