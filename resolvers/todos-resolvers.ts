import {
  addLoggedInTodosFactory,
  addTodoFactory,
  createEditString,
  deleteLoggedInTodoFactory,
  deleteTodoFactory,
  editLoggedInTodoFactory,
  editTodoFactory,
  getLoggedInTodosFactory,
  getOneLoggedInTodoFactory,
  getOneTodoFactory,
  getTodosFactory,
} from '../resolver-factories/todos/todo-crud'
import { verifyJwtFactory } from '../resolver-factories/identity/jwt-sign-verify'
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
    }),
    editTodo: editLoggedInTodoFactory({
      pool,
      editTodoFactory,
      verifyJwtFactory,
      createEditString,
      jwt,
      secret
    })
  }
}

export { rootTodosReducer }