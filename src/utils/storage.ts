import Cookies from 'js-cookie';
import type { User } from '@/types/index';

const USER_KEY = 'user_metadata';

export const getUserMetadata = (): User | null => {
  const userStr = Cookies.get(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const setUserMetadata = (user: User): void => {
  Cookies.set(USER_KEY, JSON.stringify(user), {
    expires: 7,
    sameSite: 'strict',
    secure: import.meta.env.PROD,
  });
};

export const removeUserMetadata = (): void => {
  Cookies.remove(USER_KEY);
};