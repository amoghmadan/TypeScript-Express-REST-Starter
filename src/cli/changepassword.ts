import mongoose from 'mongoose';
import { read } from 'read';

import { ChangePassword, User } from '@/interfaces/user';
import { UserModel } from '@/models';
import { accountsValidator } from '@/validators';
import { MONGODB_URI } from '@/settings';

/**
 * Chnage password
 * @param {string} email
 */
export default async function changePassword(email: string): Promise<void> {
  const password: string = await read({
    prompt: 'Password: ',
    replace: '*',
    silent: true,
  });
  const passwordAgain: string = await read({
    prompt: 'Password (again): ',
    replace: '*',
    silent: true,
  });

  try {
    const validatedData: ChangePassword = await accountsValidator
      .changePassword
      .validateAsync({
        email,
        password,
        passwordAgain,
      });
    await mongoose.connect(MONGODB_URI);
    const user: User | null = await UserModel.findOne({
      email: validatedData.email,
    });
    if (!user) {
      // eslint-disable-next-line no-console
      console.error(`Error: User '${email}' does not exist.`);
      process.exit(2);
    }
    user.password = validatedData.password;
    await user.save();
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(2);
  }
  // eslint-disable-next-line no-console
  console.info(`Password changed successfully for user '${email}'.`);
  process.exit(0);
}
