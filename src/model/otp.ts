import { Schema, model, models } from "mongoose";

export interface IOTP {
    email: string;
    otp: string;
    expiresAt: Date;
    isUsed: boolean;
    createdAt: Date;
}

const otpSchema = new Schema<IOTP>(
    {
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        otp: {
            type: String,
            required: true,
            length: 6
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
        },
        isUsed: {
            type: Boolean,
            default: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);


otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


otpSchema.index({ email: 1, isUsed: 1 });

export const OTP = models.OTP || model<IOTP>("OTP", otpSchema);
