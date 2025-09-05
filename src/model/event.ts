import mongoose,{Schema,models,model} from "mongoose";

export interface IEvent{
    title:string
    description:string
    date:Date,
    location:string,
    time: string,
    createdBy: mongoose.Schema.Types.ObjectId
}

const eventSchema=new Schema({
    title: {type:String,required:true},
    description: {type:String,required:true},
    date: {type:Date},
    location: {type:String,required:true},
    time: {type:String,required:true},
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }
},{timestamps:true})

export const Event=models.Event || model<IEvent>("Event",eventSchema);