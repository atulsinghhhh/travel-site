import mongoose, { Schema, model, models } from "mongoose";

export interface IReview {
        rating: number;
        comment: string;
        user: mongoose.Schema.Types.ObjectId;
        trip: mongoose.Schema.Types.ObjectId;
}

const reviewSchema = new Schema<IReview>(
    {
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
        trip: { type: mongoose.Schema.Types.ObjectId, ref: "Trip", required: true },
    },
    { timestamps: true }
);

export const Review = models.Review || model<IReview>("Review", reviewSchema);
