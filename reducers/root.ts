import { basicReducers } from './basic-reducers'
import { rootPgReducer } from './pg-reducers'
import { createPgPool } from '../postgres/connection'
import { Pool } from 'pg'

export interface IRootFactory {
  createPool: any
}

// TODO: add get time
const rootFactory = (depencencies: IRootFactory) => () => {
  const { createPool } = depencencies
  const pool: Pool = createPool()

  return {
    ...basicReducers,
    ...rootPgReducer(pool)
  }
};

const root = rootFactory({ createPool: createPgPool })

export { root, rootFactory }