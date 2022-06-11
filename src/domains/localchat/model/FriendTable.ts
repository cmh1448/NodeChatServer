import mongoose, { Schema } from "mongoose";
import { UserDetail, UserSummary } from "../../authentication/model/User";

export interface FriendTableDetail {
  _id: string;
  user: UserSummary;
  friends: UserSummary[];
}

const FriendTableSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
})

export const FriendTable = mongoose.model<FriendTableDetail>('FriendTable', FriendTableSchema);
