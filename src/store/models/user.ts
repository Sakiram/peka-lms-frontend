import { createModel } from '@rematch/core';
import type { RootModel } from '../index';

export const user = createModel<RootModel>()({
  state: {
    profile: null,
  },
  reducers: {
    setProfile(state, payload) {
      return { ...state, profile: payload };
    },
  },
});