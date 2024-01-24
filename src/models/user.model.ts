import { compare, genSalt, hash } from 'bcryptjs';
import {
  type CallbackError,
  type CallbackWithoutResultAndOptionalError,
  type Model,
  Schema,
  model,
} from 'mongoose';

import { Token, User } from '@/interfaces/user';

const tokenSchema: Schema<Token> = new Schema(
  {
    key: { type: String, required: true, unique: true },
  },
  { timestamps: { createdAt: 'created' } },
);

const userSchema: Schema<User> = new Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: false, default: false },
  isActive: { type: Boolean, required: true, default: true },
  dateJoined: { type: Date, required: true, default: Date.now },
  lastLogin: { type: Date, required: false },
  token: { type: tokenSchema, required: false },
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
