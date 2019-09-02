import { Pool } from 'pg'
import { getPgUserWithPasswordFactory } from '../postgres/queries'
import { signJwtFactory } from './jwt-sign-verify'
import jwt from 'jsonwebtoken'

export interface IVerifyPasswordFactory {
  pool: Pool
  getPgUserWithPasswordFactory: typeof getPgUserWithPasswordFactory
}

export interface ILoginUserFactory {
  pool: Pool,
  verifyPasswordFactory: typeof verifyPasswordFactory,
  getPgUserWithPasswordFactory: typeof getPgUserWithPasswordFactory,
  signJwtFactory: typeof signJwtFactory,
  jwt: typeof jwt
  secret: string
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

const verifyPasswordFactory = (dependencies: IVerifyPasswordFactory) => {
  const { pool, getPgUserWithPasswordFactory } = dependencies
  const getPgUserWithPassword = getPgUserWithPasswordFactory(pool)
  return async (name: string, password: string): Promise<IVerfiedPassword> => {
    const user = await getPgUserWithPassword({ name })
    const validPassword = user.password === password
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
    secret } = dependencies
  const verifyPassword = verifyPasswordFactory({ pool, getPgUserWithPasswordFactory })
  const signJwt = signJwtFactory({ jwt, secret })
  return async ({ name, password }: ILoginUser, x: any): Promise<ILoginResponse> => {
    // console.log(x.headers)
    const verifyResponse = await verifyPassword(name, password)
    return verifyResponse.isPasswordValid ?
      {
        success: true,
        token: signJwt(verifyResponse.id, verifyResponse.name)
      }
      : { success: false }
  }
}

export { verifyPasswordFactory, loginUserFactory }