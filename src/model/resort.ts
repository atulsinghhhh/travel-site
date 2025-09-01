import mongoose, { Schema, models, model } from "mongoose";

export interface IResort {
    name: string;
    location: string;
    pricePerNight: number;
    image?: string;
}

const resortSchema = new Schema<IResort>({
    name: { type: String, required: true },
    location: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    image: { type: String }
}, { timestamps: true });

export const Resort = models.Resort || model<IResort>("Resort", resortSchema);
