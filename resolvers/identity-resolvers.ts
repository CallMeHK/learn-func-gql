import { Pool } from 'pg'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { getPgUserWithPasswordFactory } from '../resolver-factories/postgres/queries'
import { loginUserFactory, verifyPasswordFactory, comparePasswordFactory } from '../resolver-factories/identity/verify-password'
import { signJwtFactory, verifyJwtFactory } from '../resolver-factories/identity/jwt-sign-verify'
import {createUserFactory, hashPasswordFactory} from '../resolver-factories/identity/user-crud'

const rootIdentityReducer = (pool: Pool) => {
  const secret: string = process.env.JWT_SECRET
  return {
    loginUser: loginUserFactory({
      pool,
      getPgUserWithPasswordFactory,
      verifyPasswordFactory,
      signJwtFactory,
      jwt,
      secret,
      bcrypt,
      comparePasswordFactory
    }),
    verifyJwt: verifyJwtFactory({
      jwt,
      secret
    }),
    createUser: createUserFactory({
      pool,
      bcrypt,
      hashPasswordFactory
    })
  }
}

export { rootIdentityReducer }