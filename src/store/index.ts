import { init, type RematchDispatch, type RematchRootState, type Models } from '@rematch/core';
import { auth } from './models/auth';
import { user } from './models/user';

export interface RootModel extends Models<RootModel> {
  auth: typeof auth;
  user: typeof user;
}

export const models: RootModel = { 
  auth,
  user,
};

export const store = init({
  models,
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;