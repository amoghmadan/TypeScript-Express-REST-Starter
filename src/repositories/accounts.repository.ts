import { Detail, Login, User } from '@/interfaces/user';
import { UserModel } from '@/models';
import { generateKey } from '@/utils/token';

export default {
  login: async (payload: Login): Promise<{ token: string } | null> => {
    const user: User | null = await UserModel.findOne({
      email: payload.email,
      isActive: true,
    });
    if (!user) return null;
    const match: boolean = await user.validatePassword(payload.password);
    if (!match) return null;
    if (!user.token) {
      user.token = { key: generateKey() };
      user.lastLogin = new Date();
      await user.save();
    }
    return { token: user.token.key };
  },
  detail: async (user: User): Promise<Detail> => ({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    dateJoined: user.dateJoined,
    isAdmin: user.isAdmin,
  }),
  logout: async (user: User): Promise<void> => {
    user.set('token', undefined, { strict: false });
    await user.save();
  },
};
