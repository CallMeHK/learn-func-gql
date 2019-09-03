import { basicReducers } from './basic-resolvers'
import { rootPgReducer } from './pg-resolvers'
import { createPgPool } from '../resolver-factories/postgres/connection'
import { Pool } from 'pg'
import { rootIdentityReducer } from './identity-resolvers';
import { rootTodosReducer } from './todos-resolvers'

export interface IRootFactory {
  createPool: any
}

// TODO: add get time
const rootFactory = (depencencies: IRootFactory) => () => {
  const { createPool } = depencencies
  const pool: Pool = createPool()

  return {
    ...basicReducers,
    ...rootPgReducer(pool),
    ...rootIdentityReducer(pool),
    ...rootTodosReducer(pool)
  }
};

const root = rootFactory({ createPool: createPgPool })

export { root, rootFactory }