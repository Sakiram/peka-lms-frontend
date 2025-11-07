import { createModel } from '@rematch/core';
import type { RootModel } from '../index';
import type { AuthState, User, } from '@/types';
import { authAPI, type LoginRequest } from '@/api/endpoints/auth';
import { getUserMetadata, setUserMetadata, removeUserMetadata } from '@/utils/storage';

export const auth = createModel<RootModel>()({
  state: {
    user: null,
    token: null,
    isAuthenticated: !!getUserMetadata(),
    loading: true,
  } as AuthState,

  reducers: {
    setLoading(state, payload: boolean) {
      return { ...state, loading: payload };
    },

    setAuth(state, payload: { user: User;}) {
      setUserMetadata(payload.user);
      return {
        ...state,
        user: payload.user,
        token: null,
        isAuthenticated: true,
        loading: false,
      };
    },

    clearAuth(state) {
      removeUserMetadata();
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    },
  },

  effects: (dispatch) => ({
    async login(credentials: LoginRequest) {
      try {
        dispatch.auth.setLoading(true);
        const response = await authAPI.login(credentials);
        dispatch.auth.setAuth({
          user: response.user,
        });
        
        return { success: true };
      } catch (error: any) {
        dispatch.auth.setLoading(false);
        return {
          success: false,
          error: error.response?.data?.message || 'Login failed',
        };
      }
    },

    async logout() {
      try {
        await authAPI.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        dispatch.auth.clearAuth();
      }
    },

     rehydrateAuth() {
      try {
        const storedUser = getUserMetadata();
        if (storedUser) {
          dispatch.auth.setAuth({user:storedUser});
        } else {
          dispatch.auth.setLoading(false);
        }
      } catch (error) {
        console.error('Failed to rehydrate auth:', error);
        dispatch.auth.setLoading(false);
      }
    },
  }),
});