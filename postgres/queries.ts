import { Pool } from 'pg'

export interface IGetPgUser {
  name: string
}

export interface IGetPgUserFactory {
  pool: Pool,
  getPgUserWithPasswordFactory: typeof getPgUserWithPasswordFactory
}

export interface IUserInfo {
  id: number,
  name: string,
  email: string,
  password?: string
}

const getPgTimeFactory = (pool: Pool) => async (): Promise<string> => {
  const time = await pool.query('SELECT NOW()')
  const now: string = time.rows[0].now
  return now
}

const getPgUserWithPasswordFactory = (pool: Pool) =>
  async ({ name }: IGetPgUser): Promise<IUserInfo> => {
    const query = `SELECT * FROM users WHERE name='${name}'`
    const userQuery = await pool.query(query)
    const user = userQuery.rows[0]
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password
    }
  }

const getPgUserFactory = (dependencies: IGetPgUserFactory) => {
  const { pool, getPgUserWithPasswordFactory } = dependencies
  const getPgUserWithPassword = getPgUserWithPasswordFactory(pool)
  return async ({ name }: IGetPgUser): Promise<IUserInfo> => {
    const user = await getPgUserWithPassword({ name })
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  }
}

export { getPgTimeFactory, getPgUserWithPasswordFactory, getPgUserFactory }