// {
//   loginUser(name: "Ty", password: "420") {
//     success,
//     token
//   }
// }

interface ILogIn {
  loginUser:{
    success: boolean,
    token: string
  }
}

export { ILogIn }