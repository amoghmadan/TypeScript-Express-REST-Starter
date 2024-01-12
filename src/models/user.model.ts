import { compare, genSalt, hash } from 'bcryptjs';
import {
  type CallbackError,
  type CallbackWithoutResultAndOptionalError,
  type Model,
  Schema,
  model,
} from 'mongoose';

import { Token, User } from '../interfaces/user';

const tokenSchema: Schema<Token> = new Schema(
  {
    key: { type: String, require: true, unique: true },
  },
  { timestamps: { createdAt: 'created' } },
);

const userSchema: Schema<User> = new Schema({
  email: { type: String, require: true, unique: true },
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  password: { type: String, require: true },
  isAdmin: { type: Boolean, require: false, default: false },
  isActive: { type: Boolean, require: true, default: true },
  dateJoined: { type: Date, require: true, default: Date.now },
  lastLogin: { type: Date, require: false },
  token: { type: tokenSchema, require: false },
});

userSchema.pre(
  'save',
  // eslint-disable-next-line func-names
  async function (next: CallbackWithoutResultAndOptionalError): Promise<void> {
    // eslint-disable-next-line no-invalid-this
    if (!this.isModified('password')) return next();
    try {
      const salt: string = await genSalt(12);
      // eslint-disable-next-line no-invalid-this
      const hashedPassword: string = await hash(this.password, salt);
      // eslint-disable-next-line no-invalid-this
      this.password = hashedPassword;
      return next();
    } catch (e: unknown) {
      return next(e as CallbackError | undefined);
    }
  },
);

// eslint-disable-next-line func-names
userSchema.methods.validatePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  // eslint-disable-next-line no-invalid-this
  const success: boolean = await compare(candidatePassword, this.password);
  return success;
};

const UserModel: Model<User> = model<User>('User', userSchema);

export default UserModel;
