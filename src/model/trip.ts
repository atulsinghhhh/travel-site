import mongoose, { Schema, model, models,Document } from "mongoose";

export interface ITrip extends Document{
    userId: mongoose.Schema.Types.ObjectId
    title: string;
    startDate: Date;
    endDate: Date;
    image: string;
    isCanceled: boolean;
}

const tripSchema = new Schema<ITrip>(
    {
        title: { type: String, required: true },
        startDate: {type: Date, required: true},
        endDate: {type: Date, required: true},
        image: { type: String },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
        isCanceled: {type: Boolean,default:false}
    },
    { timestamps: true }
);

export const Trip = models.Trip || model<ITrip>("Trip", tripSchema);
