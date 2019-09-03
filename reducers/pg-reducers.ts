import { getPgTimeFactory, getPgUser } from '../resolver-factories/postgres/queries'
import { Pool } from 'pg'

const rootPgReducer = (pool: Pool) => {
  return {
    getPgTime: getPgTimeFactory(pool),
    getPgUser: getPgUser(pool)
  }
}

export { rootPgReducer }