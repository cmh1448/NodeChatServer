import { RouterContext } from 'koa-router';
import mongoose, { ObjectId } from 'mongoose';
import { Context } from 'vm';
import { Exeption } from '../../exception/Exception';

export enum Role {
  Developer = 'Developer',
  Admin = 'Admin',
  Normal = 'Normal',
}
export interface UserSummary {
  _id: string;
  name: string;
  email: string;
  role: Role;
}
export interface UserDetail extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  salt: string;
  insertDate: Date;
  lastUpdateDate: Date;
  role: Role;
}

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  salt: String,
  insertDate: {
    type: Date,
    default: Date.now(),
  },
  lastUpdateDate: {
    type: Date,
    default: Date.now(),
  },
  role: {
    type: String,
    nullable: false,
    enum: Role,
    default: Role.Normal,
  },
});

UserSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  delete obj.salt;
  return obj;
};

export const User = mongoose.model<UserDetail>('User', UserSchema);

export async function getUserFromContext(ctx: RouterContext | Context) {
  if (ctx.state.user === undefined) throw new Exeption('Unauthorized', 401);

  const user = await User.findOne({
    ...ctx.state.user,
  });

  if (!user) throw new Exeption('User Not Found In Repository', 404);

  return user;
}
