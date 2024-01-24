import { Detail, User } from '@/interfaces/user';
import { accountsRepository } from '@/repositories';
import { accountsValidator } from '@/validators';

export default {
  login: async (payload: {
    email: string;
    password: string;
  }): Promise<{ token: string } | null> => {
    const validatedData = await accountsValidator.login.validateAsync(payload);
    return accountsRepository.login(validatedData);
  },
  detail: async (user: User): Promise<Detail> => accountsRepository.detail(
    user,
  ),
  logout: async (user: User): Promise<void> => accountsRepository.logout(user),
};
