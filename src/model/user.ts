import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs"

export interface IUser {
    fullname: string;
    username: string;
    email: string;
    password: string;
    avatar?: string;
    bio?: string;
    joinedAt: Date;
    tripsCount: number;
    role: string;
    wishlist: mongoose.Schema.Types.ObjectId[];
    savedTrips: mongoose.Schema.Types.ObjectId[];
    reviews: mongoose.Schema.Types.ObjectId[];
    travelBudget: {
        total: number;
        spent: number;
    };
    following: mongoose.Schema.Types.ObjectId[]
}

const userSchema = new Schema<IUser>(
    {
        fullname: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        avatar: { type: String },
        bio: { type: String, default: "" },
        joinedAt: { type: Date, default: Date.now },

        tripsCount: { type: Number, default: 0 },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Destination",
            },
        ],

        savedTrips: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Trip",
            },
        ],

        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review",
            },
        ],

        travelBudget: {
            total: { type: Number, default: 0 },
            spent: { type: Number, default: 0 },
        },
        following: [{ type: Schema.Types.ObjectId, ref: "Users" }]

    },
    { timestamps: true }
);
userSchema.pre("save",async function(next){
    if(!this.isModified) return;
    this.password=await bcrypt.hash(this.password,10);
    next();
})

export const Users = models.Users || model<IUser>("Users", userSchema);
