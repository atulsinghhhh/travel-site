import mongoose, { Schema, model, models,Document } from "mongoose";

export interface ITrip extends Document{
    userId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    activities: string[];
    expenses: [{
        title: string;
        amount: number;
    }],
    isCanceled?: boolean;
}

const tripSchema = new Schema<ITrip>({
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    title: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    location: { type: String, required: true },
    activities: [{ type: String }],
    expenses: [
        {
            title: { type: String, required: true },
            amount: { type: Number, required: true },
        },
    ],
    isCanceled: { type: Boolean, default: false },
},{timestamps:true});

export const Trips = models.Trips || model<ITrip>("Trips", tripSchema);
