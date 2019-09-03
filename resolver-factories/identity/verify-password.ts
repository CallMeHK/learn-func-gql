import { Pool } from 'pg'
import bcrypt from 'bcrypt'
import { getPgUserWithPasswordFactory } from '../postgres/queries'
import { signJwtFactory } from './jwt-sign-verify'
import jwt from 'jsonwebtoken'

export interface IVerifyPasswordFactory {
  pool: Pool,
  bcrypt: typeof bcrypt
  getPgUserWithPasswordFactory: typeof getPgUserWithPasswordFactory,
  comparePasswordFactory: typeof comparePasswordFactory
}

export interface ILoginUserFactory {
  pool: Pool,
  verifyPasswordFactory: typeof verifyPasswordFactory,
  getPgUserWithPasswordFactory: typeof getPgUserWithPasswordFactory,
  signJwtFactory: typeof signJwtFactory,
  jwt: typeof jwt
  secret: string,
  bcrypt: typeof bcrypt,
  comparePasswordFactory: typeof comparePasswordFactory
}

export interface ILoginUser {
  name: string,
  password: string
}

export interface IVerfiedPassword {
  isPasswordValid: boolean,
  id?: number,
  name?: string,
}
export interface ILoginResponse {
  success: boolean,
  token?: string
}

export interface IComparePasswordFactory {
  bcrypt: typeof bcrypt
}

const comparePasswordFactory = (dependencies: IComparePasswordFactory) => {
  const { bcrypt } = dependencies
  return async (password: string, hashedPassword: string): Promise<boolean> => {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword)
    return isPasswordValid
  }
}

const verifyPasswordFactory = (dependencies: IVerifyPasswordFactory) => {
  const { pool,
    bcrypt,
    getPgUserWithPasswordFactory,
    comparePasswordFactory } = dependencies
  const getPgUserWithPassword = getPgUserWithPasswordFactory(pool)
  const comparePassword = comparePasswordFactory({ bcrypt })
  return async (name: string, password: string): Promise<IVerfiedPassword> => {
    const user = await getPgUserWithPassword({ name })
    const validPassword = await comparePassword(password, user.password)
    return validPassword ? {
      isPasswordValid: true,
      id: user.id,
      name: user.name
    } : {
        isPasswordValid: false
      }
  }
}

const loginUserFactory = (dependencies: ILoginUserFactory) => {
  const {
    pool,
    verifyPasswordFactory,
    getPgUserWithPasswordFactory,
    signJwtFactory,
    jwt,
    secret,
    bcrypt,
    comparePasswordFactory } = dependencies
  const verifyPassword = verifyPasswordFactory({ pool, bcrypt, comparePasswordFactory, getPgUserWithPasswordFactory })
  const signJwt = signJwtFactory({ jwt, secret })
  return async ({ name, password }: ILoginUser, x: any): Promise<ILoginResponse> => {
    const verifyResponse = await verifyPassword(name, password)
    return verifyResponse.isPasswordValid === true ?
      {
        success: true,
        token: signJwt(verifyResponse.id, verifyResponse.name)
      }
      : { success: false }
  }
}

export { verifyPasswordFactory, loginUserFactory, comparePasswordFactory }