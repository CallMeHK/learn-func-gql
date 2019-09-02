import {
  addLoggedInTodosFactory,
  addTodoFactory,
  deleteLoggedInTodoFactory,
  deleteTodoFactory,
  getLoggedInTodosFactory,
  getOneLoggedInTodoFactory,
  getOneTodoFactory,
  getTodosFactory,
} from '../todos/todo-crud'
import { verifyJwtFactory } from '../identity/jwt-sign-verify'
import jwt from 'jsonwebtoken'
import { Pool } from 'pg'

const rootTodosReducer = (pool: Pool) => {
  const secret = process.env.JWT_SECRET
  return {
    getTodos: getLoggedInTodosFactory({
      pool,
      getTodosFactory,
      verifyJwtFactory,
      jwt,
      secret
    }),
    addTodo: addLoggedInTodosFactory({
      pool,
      addTodoFactory,
      verifyJwtFactory,
      jwt,
      secret
    }),
    getOneTodo: getOneLoggedInTodoFactory({
      pool,
      getOneTodoFactory,
      verifyJwtFactory,
      jwt,
      secret
    }),
    deleteTodo: deleteLoggedInTodoFactory({
      pool,
      deleteTodoFactory,
      verifyJwtFactory,
      jwt,
      secret
    })
  }
}

export { rootTodosReducer }