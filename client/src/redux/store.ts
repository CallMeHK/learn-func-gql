import { createStore, combineReducers, applyMiddleware } from 'redux'
import userReducer, { IUserState } from "./user-reducer/userReducer"
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';


export interface IRootState {
  user: IUserState
}

const reducer = combineReducers<IRootState>({
  user: userReducer
})

export default createStore(
  reducer,
  composeWithDevTools(applyMiddleware(thunk))
)