import mongoose, { Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface ICaptian extends Document {
  _id: mongoose.Types.ObjectId;
  fullname: {
    firstname: string;
    lastname: string;
  };
  email: string;
  password: string;
  socketId?: string;
  status: "active" | "inactive";

  vehicle: {
    color: string;
    plate: number;
    capacity: number;
    vehicleType: string;
  };

  location: {
    ltd: number;
    lng: number;
  };
}

const captainSchema = new mongoose.Schema<ICaptian>({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "Firstname must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "Lastname must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  socketId: {
    type: String,
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },

  vehicle: {
    color: {
      type: String,
      required: true,
      minlength: [3, "Color must be at least 3 characters long"],
    },
    plate: {
      type: String,
      required: true,
      minlength: [3, "Plate must be at least 3 characters long"],
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, "Capacity must be at least 1"],
    },
    vehicleType: {
      type: String,
      required: true,
      enum: ["car", "motorcycle", "auto"],
    },
  },

  location: {
    ltd: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
});

captainSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const captainModel =
  (mongoose.models.Captian as mongoose.Model<ICaptian>) ||
  mongoose.model<ICaptian>("Captian", captainSchema);

export default captainModel;
