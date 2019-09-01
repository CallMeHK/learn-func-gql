import { Pool, PoolConfig } from 'pg'

export interface ICreatePgPoolFactory {
  pgPool: any
}

const createPgPoolFactory =
  (dependencies: ICreatePgPoolFactory) =>
    () => {
      const { pgPool } = dependencies
      const pool: Pool = new pgPool({
        connectionString: process.env.POSTGRES_URL
      })
      return pool
    }

const createPgPool = createPgPoolFactory({pgPool: Pool})

export {
  createPgPool,
  createPgPoolFactory
}