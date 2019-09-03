import { Pool } from 'pg'
import bcrypt from 'bcrypt'
import { getPgUserWithPasswordFactory } from '../postgres/queries'
import { signJwt } from './jwt-sign-verify'
import jwt from 'jsonwebtoken'

export interface IVerifyPasswordFactory {
  bcrypt: typeof bcrypt
  getPgUserWithPasswordFactory: typeof getPgUserWithPasswordFactory,
  comparePasswordFactory: typeof comparePasswordFactory
}

export interface ILoginUserFactory {
  verifyPassword: typeof verifyPassword,
  signJwt: typeof signJwt,
  jwt: typeof jwt
  secret: string,
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
  const {
    bcrypt,
    getPgUserWithPasswordFactory,
    comparePasswordFactory } = dependencies
  return (pool: Pool) => {
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
}

const verifyPassword = verifyPasswordFactory({
  bcrypt,
  getPgUserWithPasswordFactory,
  comparePasswordFactory
})

const loginUserFactory = (dependencies: ILoginUserFactory) => {
  const {
    verifyPassword,
    signJwt,
  } = dependencies
  return (pool: Pool) => {
    const verifyPasswordPool = verifyPassword(pool)

    return async ({ name, password }: ILoginUser, x: any): Promise<ILoginResponse> => {
      const verifyResponse = await verifyPasswordPool(name, password)
      return verifyResponse.isPasswordValid === true ?
        {
          success: true,
          token: signJwt(verifyResponse.id, verifyResponse.name)
        }
        : { success: false }
    }
  }
}

const loginUser = loginUserFactory({
  verifyPassword,
  signJwt,
  jwt,
  secret: process.env.JWT_SECRET,
})

export {
  comparePasswordFactory,
  loginUser,
  loginUserFactory,
  verifyPassword,
  verifyPasswordFactory,
}