import { Pool } from 'pg'
import bcrypt from 'bcrypt'

export interface IHashPassword {
  bcrypt: typeof bcrypt
}

export interface ICreateUserFactory {
  bcrypt: typeof bcrypt,
  hashPasswordFactory: typeof hashPasswordFactory
}

export interface ICreateUser {
  name: string,
  email: string,
  password: string
}

const hashPasswordFactory = (dependencies: IHashPassword) => {
  const { bcrypt } = dependencies
  return async (password: string): Promise<string> => {
    const hashedPassword = await bcrypt.hash(password, 10)
    return hashedPassword
  }
}

const createUserFactory = (dependencies: ICreateUserFactory) => {
  const {
    bcrypt,
    hashPasswordFactory
  } = dependencies
  return (pool: Pool) => {
    const hashPassword = hashPasswordFactory({bcrypt})
    
    return async ({ name, email, password }: ICreateUser) => {
    const hashedPassword = await hashPassword(password)
    const newUser = {
      name,
      email,
      password: hashedPassword
    }
    const createUser = await pool.query(`INSERT INTO users (name, email, password)
    VALUES ('${newUser.name}', '${newUser.email}', '${newUser.password}' ) 
    RETURNING *`)
    return createUser.rows[0]
  }}
}

const createUser = createUserFactory({bcrypt,
  hashPasswordFactory})

export {
  hashPasswordFactory,
  createUserFactory,
  createUser
}