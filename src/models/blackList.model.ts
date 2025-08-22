import mongoose, { Document } from "mongoose";

export interface IBlackList extends Document {
  token: string;
  createdAt: Date;
}

const blacklistTokenSchema = new mongoose.Schema<IBlackList>({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // 24 hours in seconds
  },
});

const BlackListModel =
  (mongoose.models.BlackList as mongoose.Model<IBlackList>) ||
  mongoose.model<IBlackList>("BlackList", blacklistTokenSchema);

export default BlackListModel;
