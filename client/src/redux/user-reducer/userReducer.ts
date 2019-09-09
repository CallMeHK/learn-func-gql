import { IUserAction } from './userActions'

export interface IUserState {
  token: null | string
}


const userReducer =
  (state: IUserState = {
    token: null
  },
    action: IUserAction) => {
    switch (action.type) {
      case "set-token":
        return {
          ...state,
          token: action.payload
        };
      default:
        return state;
    }
  };

export default userReducer