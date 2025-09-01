import mongoose, { Schema, models, model } from "mongoose";

export interface IFlight {
    airline: string;
    from: string;
    to: string;
    departure: Date;
    arrival: Date;
    price: number;
    image?: string;
}

const flightSchema = new Schema<IFlight>({
    airline: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    departure: { type: Date, required: true },
    arrival: { type: Date, required: true },
    price: { type: Number, required: true },
    image: { type: String }
}, { timestamps: true });

export const Flight = models.Flight || model<IFlight>("Flight", flightSchema);


export interface ICar {
    brand: string;
    model: string;
    pricePerDay: number;
    image?: string;
}

const carSchema = new Schema<ICar>({
    brand: { type: String, required: true },
    model: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    image: { type: String }
}, { timestamps: true });

export const Car = models.Car || model<ICar>("Car", carSchema);

