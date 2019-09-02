import { getPgTimeFactory, getPgUserWithPasswordFactory, getPgUserFactory } from '../postgres/queries'
import { Pool } from 'pg'

const rootPgReducer = (pool: Pool) => {
  return {
    getPgTime: getPgTimeFactory(pool),
    getPgUser: getPgUserFactory({ pool, getPgUserWithPasswordFactory })
  }
}

export { rootPgReducer }