import { Pool } from 'pg'

import {
  addLoggedInTodos,
  deleteLoggedInTodo,
  editLoggedInTodo,
  getLoggedInTodos,
  getOneLoggedInTodo,
} from '../resolver-factories/todos/todo-crud'

const rootTodosReducer = (pool: Pool) => {
  return {
    getTodos: getLoggedInTodos(pool),
    addTodo: addLoggedInTodos(pool),
    getOneTodo: getOneLoggedInTodo(pool),
    deleteTodo: deleteLoggedInTodo(pool),
    editTodo: editLoggedInTodo(pool)
  }
}

export { rootTodosReducer }