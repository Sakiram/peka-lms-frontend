import { init, type RematchDispatch, type RematchRootState, type Models } from '@rematch/core';
import { auth } from './models/auth';

export interface RootModel extends Models<RootModel> {
  auth: typeof auth;
}

export const models: RootModel = { 
  auth,
};

export const store = init({
  models,
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;