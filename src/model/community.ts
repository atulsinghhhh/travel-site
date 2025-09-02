import mongoose,{Schema,models,model} from "mongoose";

export interface ICommunity{
    userId: string
    name: string
    content:string
    image: string
    hashtags: [string],
    createdBy: mongoose.Schema.Types.ObjectId
}

const communitySchema=new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    name: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required:true
    },
    image: {type: String},
    hashtags: [
        {type:String}
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }
},{timestamps:true})

export const Community=models.Community || model<ICommunity>("Community",communitySchema);