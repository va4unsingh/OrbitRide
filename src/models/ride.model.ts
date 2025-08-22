import mongoose from "mongoose";

export interface IRide extends Document {
  user: mongoose.Types.ObjectId;
  captain: mongoose.Types.ObjectId;
  pickup: string;
  destination: string;
  fare: number;
  status: "pending" | "accepted" | "ongoing" | "completed" | "cancelled";
  duration: number;
  distance: number;
  paymentID: string;
  orderId: string;
  signature: string;
  otp: string;
}

const rideSchema = new mongoose.Schema<IRide>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  captain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "captain",
  },
  pickup: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  fare: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "ongoing", "completed", "cancelled"],
    default: "pending",
  },

  duration: {
    type: Number,
  }, // in seconds

  distance: {
    type: Number,
  }, // in meters

  paymentID: {
    type: String,
  },
  orderId: {
    type: String,
  },
  signature: {
    type: String,
  },

  otp: {
    type: String,
    select: false,
    required: true,
  },
});

const RideModel =
  (mongoose.models.Ride as mongoose.Model<IRide>) ||
  mongoose.model<IRide>("Ride", rideSchema);

export default RideModel;
