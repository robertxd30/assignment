import { Schema, model } from 'mongoose';
import { User } from '../interfaces/UserInterface';

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

const UserModel = model<User>('User', userSchema);

export default UserModel;