import { Pool } from 'pg'
import jwt from 'jsonwebtoken'
import { loginUser } from '../resolver-factories/identity/verify-password'
import { verifyJwt } from '../resolver-factories/identity/jwt-sign-verify'
import { createUser } from '../resolver-factories/identity/user-crud'

const rootIdentityReducer = (pool: Pool) => {
  const secret: string = process.env.JWT_SECRET
  return {
    loginUser: loginUser(pool),
    verifyJwt,
    createUser: createUser(pool)
  }
}

export { rootIdentityReducer }