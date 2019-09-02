import { Pool } from 'pg'
import jwt from 'jsonwebtoken'
import { getPgUserWithPasswordFactory } from '../postgres/queries'
import { loginUserFactory, verifyPasswordFactory } from '../identity/verify-password'
import { signJwtFactory, verifyJwtFactory } from '../identity/jwt-sign-verify'

const rootIdentityReducer = (pool: Pool) => {
  const secret: string = process.env.JWT_SECRET
  return {
    loginUser: loginUserFactory({
      pool,
      getPgUserWithPasswordFactory,
      verifyPasswordFactory,
      signJwtFactory,
      jwt,
      secret
    }),
    verifyJwt: verifyJwtFactory({
      jwt,
      secret
    })
  }
}

export { rootIdentityReducer }