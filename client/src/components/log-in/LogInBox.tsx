import React, { useCallback } from 'react'
import { useSelector, useDispatch } from "react-redux"

import { setToken } from '../../redux/user-reducer/userActions'
import { IRootState } from '../../redux/store'
import { useGql, useGqlCallback } from '../../hooks/useGql'

import {ILogIn} from '../../types/gql'

const LogInBox = () => {
  const { token } = useSelector((state: IRootState) => state.user)

  const dispatch = useDispatch();

  const changeToken = useCallback(
    (e: string) => dispatch(setToken(e)),
    [token, dispatch],
  )

  const getAndChangeToken = useCallback(
    (response: ILogIn) => {
      changeToken(response.loginUser.token)
    },
    [changeToken],
  )

  const query: string = `{
    loginUser(name: "Ty", password: "420") {
      success,
      token
    }
  }`

  const clickLogIn = useGqlCallback<ILogIn>(query, getAndChangeToken)


  const {loading, data} = useGql<ILogIn>(query)

  return (
    <div>
      <div>{token ? token : 'token is null'}</div>
      <div>
        <button onClick={clickLogIn}>Change token</button>
      </div>
      <div>
        {loading ? 'loading...' : JSON.stringify(data)}
      </div>
    </div>)
}

export default LogInBox