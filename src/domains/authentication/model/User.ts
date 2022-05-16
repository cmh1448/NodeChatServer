import mongoose from 'mongoose';

export interface UserDetail {
  email: string;
  name: string;
  password: string;
  salt: string;
  insertDate: Date;
  lastUpdateDate: Date;
  role: String;
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
    enum: ['Developer', 'Admin', 'Normal'],
    default: 'Normal',
  },
});

UserSchema.methods.toJSON = function () {
  let obj = this.toObject();
  delete obj.password;
  delete obj.salt;
  return obj;
};

const User = mongoose.model<UserDetail>('User', UserSchema);
export default User;
