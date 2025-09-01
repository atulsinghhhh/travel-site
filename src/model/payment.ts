import mongoose, { Schema, models, model } from "mongoose";

export interface IPayment {
    userId: mongoose.Types.ObjectId;
    bookingType: "resort" | "flight" | "car";
    bookingId: mongoose.Types.ObjectId;
    amount: number;
    status: "pending" | "success" | "failed";
    method: "card" | "upi" | "netbanking" | "wallet";
}

const paymentSchema = new Schema<IPayment>({
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    bookingType: { type: String, enum: ["resort", "flight", "car"], required: true },
    bookingId: { type: Schema.Types.ObjectId, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
    method: { type: String, enum: ["card", "upi", "netbanking", "wallet"], required: true }
}, { timestamps: true });

export const Payment = models.Payment || model<IPayment>("Payment", paymentSchema);
