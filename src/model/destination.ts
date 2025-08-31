import mongoose, { Schema, model, models } from "mongoose";

export interface IDestination {
    name: string;
    country: string;
    category: "Beaches" | "Mountains" | "City" | "Adventure" | "Relaxation" | "Monument";
    image: string;
    description: string;
    createdBy: mongoose.Schema.Types.ObjectId
}

const destinationSchema = new Schema<IDestination>(
    {
        name: { type: String, required: true },
        country: { type: String, required: true },
        category: { type: String, enum: ["Beaches", "Mountains", "City", "Adventure", "Relaxation","Monument"] },
        image: { type: String,required: true },
        description: { type: String },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        }
    },
    { timestamps: true }
);

export const Destination = models.Destination || model<IDestination>("Destination", destinationSchema);
