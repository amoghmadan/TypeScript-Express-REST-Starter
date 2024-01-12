import mongoose from 'mongoose';
import { read } from 'read';

import { User } from '../interfaces/user';
import { UserModel } from '../models';
import { accountsValidator } from '../validators';
import { MONGODB_URI } from '../settings';

/**
 * Create super user
 */
export default async function createSuperUser(): Promise<void> {
  const email: string = await read({ prompt: 'Email: ' });
  const firstName: string = await read({ prompt: 'First name: ' });
  const lastName: string = await read({ prompt: 'Last name: ' });
  const password: string = await read({ prompt: 'Password: ', replace: '*', silent: true });
  const passwordAgain: string = await read({
    prompt: 'Password (again): ',
    replace: '*',
    silent: true,
  });

  try {
    const validatedData: User = await accountsValidator.createUser.validateAsync({
      email,
      firstName,
      lastName,
      password,
      passwordAgain,
      isAdmin: true,
    });
    await mongoose.connect(MONGODB_URI);
    const user: User | null = await UserModel.findOne({ email });
    if (user) {
      // eslint-disable-next-line no-console
      console.error('Error: That email is already taken.');
      process.exit(2);
    }
    const newUser: User = new UserModel(validatedData);
    await newUser.save();
  } catch (err: unknown) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(2);
  }
  // eslint-disable-next-line no-console
  console.info('Superuser created successfully.');
  process.exit(0);
}
