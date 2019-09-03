import { getPgTimeFactory } from './queries'
import {Pool} from 'pg'

describe('ts-jest is working', () => {
  let pool: any
  let user: any
  beforeEach(() => {
    pool = {
      query: jest.fn()
    }
    user = {
      id: 1,
      name: "ty",
      email: "ty@ty.com",
      password: 123,
    }
  })
  it('#getPgTimeFactory', async () => {
    let timeRes: any = { rows: [{ now: 5 }] }
    pool.query.mockImplementation(() => Promise.resolve(timeRes))
    const getPgTime = getPgTimeFactory(pool)
    const time = await getPgTime()
    expect(time).toBe(5)
  })
})