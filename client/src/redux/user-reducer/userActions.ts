import { ThunkAction } from "redux-thunk"
import { Action, ActionCreator, Dispatch } from 'redux';
import { IUserState } from './userReducer'


export interface ISetToken {
  type: 'set-token'
  payload: string
}

export type IUserAction = ISetToken

const setToken = (
  token: string
): ThunkAction<void, IUserState, null, Action<string>> => dispatch => {
  dispatch({
    type: 'set-token',
    payload: token
  })
}

export { setToken }