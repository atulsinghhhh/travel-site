import mongoose,{Schema,models,model} from "mongoose";

export interface ICommunity{
    userId: string
    content:string
    image: string
    hashtags: [string]
    event: mongoose.Schema.Types.ObjectId
}

const communitySchema=new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    content: {
        type: String,
        required:true
    },
    hashtags: [
        {type:String}
    ],
    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }
},{timestamps:true})

export const Community=models.Community || model<ICommunity>("Community",communitySchema);