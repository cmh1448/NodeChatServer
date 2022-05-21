import mongoose, { Schema } from 'mongoose';
import { UserDetail } from '../../authentication/model/User';

export interface RoomDetail {
  _id: string;
  users: UserDetail[];
  admin: UserDetail;
  name: string;
  description: string;
  userlimit: number;
}

const RoomSchema = new mongoose.Schema({
  users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  admin: { type: Schema.Types.ObjectId, ref: 'User' },
  name: String,
  description: String,
  userlimit: {
    type: Number,
    min: 2,
  },
});

RoomSchema.methods.toJSON = function () {
  let obj = this.toObject();
  return obj;
};

export const Room = mongoose.model<RoomDetail>('Room', RoomSchema);
