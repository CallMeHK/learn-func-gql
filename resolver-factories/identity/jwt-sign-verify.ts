import jwt from 'jsonwebtoken'

export interface IJwtFactory {
  jwt: typeof jwt,
  secret: string
}

export interface IJwtVerifyResponse {
  success: boolean,
  id?: number,
  name?: string,
  iat?: number,
  error?: string
}

const signJwtFactory = (dependencies: IJwtFactory) => {
  const { jwt, secret } = dependencies
  return (id: number, name: string): string => {
    const token = jwt.sign({ id, name }, secret)
    return token
  }
}

const verifyJwtFactory = (dependencies: IJwtFactory) => {
  const { jwt, secret } = dependencies
  return ({ token }: { token: string }): IJwtVerifyResponse => {
    let res: IJwtVerifyResponse
    jwt.verify(token, secret, (err, decoded: object) => {
      res = err ? { success: false, error: err.message } : { success: true, ...decoded }
    })
    return res
  }
}

export { signJwtFactory, verifyJwtFactory }