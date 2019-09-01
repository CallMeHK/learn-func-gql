import { Pool } from 'pg'

export interface IGetPgUserFactory {
  name: string 
}

export interface IUserInfo {
  id: number,
  name: string, 
  email: string
}
const getPgTimeFactory = (pool: Pool) => async (): Promise<string> => {
  const time = await pool.query('SELECT NOW()')
  const now: string = time.rows[0].now
  return now
}

const getPgUserFactory = (pool: Pool) => async ({ name }: IGetPgUserFactory): Promise<IUserInfo> => {
  const query = `SELECT * FROM users WHERE name='${name}'`
  const userQuery: any = await pool.query(query)
  const user = userQuery.rows[0]
  console.log(user)
  return {
    id: user.id,
    name: user.name,
    email: user.email
  }
}

export { getPgTimeFactory, getPgUserFactory }