import mongoose,{Schema,models,model} from "mongoose";

export interface IFlightBooking {
    userId: mongoose.Types.ObjectId;
    flightId: mongoose.Types.ObjectId;
    seats: number;
    totalPrice: number;
}

const flightBookingSchema = new Schema<IFlightBooking>({
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    flightId: { type: Schema.Types.ObjectId, ref: "Flight", required: true },
    seats: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
}, { timestamps: true });

export const FlightBooking = models.FlightBooking || model<IFlightBooking>("FlightBooking", flightBookingSchema);


export interface ICarBooking {
    userId: mongoose.Types.ObjectId;
    carId: mongoose.Types.ObjectId;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
}

const carBookingSchema = new Schema<ICarBooking>({
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    carId: { type: Schema.Types.ObjectId, ref: "Car", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true }
}, { timestamps: true });

export const CarBooking = models.CarBooking || model<ICarBooking>("CarBooking", carBookingSchema);


export interface IBooking {
    userId: mongoose.Types.ObjectId;
    resortId: mongoose.Types.ObjectId;
    checkIn: Date;
    checkout: Date;
    totalPrice: number;
}

const bookingSchema = new Schema<IBooking>({
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    resortId: { type: Schema.Types.ObjectId, ref: "Resort", required: true },
    checkIn: { type: Date, required: true },
    checkout: { type: Date, required: true },
    totalPrice: { type: Number, required: true }
}, { timestamps: true });

export const ResortBooking = models.ResortBooking || model<IBooking>("ResortBooking", bookingSchema);
