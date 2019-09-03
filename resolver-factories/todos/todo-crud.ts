import { Pool } from 'pg'
import jwt from 'jsonwebtoken'
import { verifyJwtFactory } from '../identity/jwt-sign-verify'

export interface ITodosFactory {
  pool: Pool
}

export interface IEditTodosFactory {
  createEditString: typeof createEditString
}

export interface ITodo {
  id?: number,
  todo: string,
  done: boolean,
  user_id: number
}

export interface ITodos {
  todos: ITodo[]
}

export interface IAuthError {
  error: string
}

export interface IGetLoggedInTodosFactory {
  getTodos: typeof getTodos,
  verifyJwtFactory: typeof verifyJwtFactory,
  jwt: typeof jwt,
  secret: string
}

export interface IAddLoggedInTodosFactory {
  addTodo: typeof addTodo,
  verifyJwtFactory: typeof verifyJwtFactory,
  jwt: typeof jwt,
  secret: string
}

export interface IGetOneLoggedInTodosFactory {
  getOneTodo: typeof getOneTodo,
  verifyJwtFactory: typeof verifyJwtFactory,
  jwt: typeof jwt,
  secret: string
}

export interface IDeleteLoggedInTodosFactory {
  deleteTodo: typeof deleteTodo,
  verifyJwtFactory: typeof verifyJwtFactory,
  jwt: typeof jwt,
  secret: string
}

export interface IEditLoggedInTodosFactory {
  editTodo: typeof editTodo,
  verifyJwtFactory: typeof verifyJwtFactory,
  jwt: typeof jwt,
  secret: string
}

const getTodos = (pool: Pool) => {

  return async ({ user_id }: { user_id: number }): Promise<ITodos> => {
    const todosQuery = await pool.query(`SELECT * FROM todos WHERE user_id=${user_id}`)
    const todos = todosQuery.rows
    return { todos }
  }
}

const addTodo = (pool: Pool) => {

  return async ({ todo, done, user_id }: { todo: string, done?: boolean, user_id: number }): Promise<ITodo> => {
    const todosQuery = await pool.query(`INSERT INTO todos (todo, done, user_id)
    VALUES ('${todo}', ${done}, ${user_id}) 
    RETURNING *`)
    return todosQuery.rows[0]
  }
}

const getOneTodo = (pool: Pool) => {
  return async ({ id, user_id }: { id: number, user_id: number }): Promise<ITodo> => {
    const todosQuery = await pool.query(`SELECT * FROM todos 
    WHERE id=${id} AND user_id=${user_id}`)
    return todosQuery.rows[0]
  }
}

const deleteTodo = (pool: Pool) => {

  return async ({ id, user_id }: { id: number, user_id: number }): Promise<ITodo> => {
    const todosQuery = await pool.query(`DELETE FROM todos 
    WHERE id=${id} AND user_id=${user_id}
    RETURNING *`)
    return todosQuery.rows[0]
  }
}

const createEditString = (edit: { todo?: string, done?: boolean }): string => {
  if (edit.todo && edit.done !== undefined) {
    return `todo='${edit.todo}', done=${edit.done}`
  } else if (edit.todo) {
    return `todo='${edit.todo}'`
  }
  return `done=${edit.done}`
}

const editTodoFactory = (dependencies: IEditTodosFactory) => {

  const { createEditString } = dependencies

  return (pool: Pool) =>
    async ({ id, user_id, todo, done }: { id: number, user_id: number, todo?: string, done?: boolean }): Promise<ITodo> => {
      const editString = createEditString({ todo, done })
      const todosQuery = await pool.query(`UPDATE todos 
    SET ${editString} 
    WHERE id=${id} AND user_id=${user_id}
    RETURNING *`)
      return todosQuery.rows[0]
    }
}

const editTodo = editTodoFactory({ createEditString })

const getLoggedInTodosFactory = (dependencies: IGetLoggedInTodosFactory) => {

  const {
    getTodos,
    verifyJwtFactory,
    jwt,
    secret } = dependencies

  return (pool: Pool) => {
    const getTodosPool = getTodos(pool)
    const verifyJwt = verifyJwtFactory({ secret, jwt })

    return async (__: any, { headers }: { headers: any }): Promise<ITodos | IAuthError> => {
      const isJwtValid = verifyJwt({ token: headers.auth_token })
      if (isJwtValid.success) {
        const todos = await getTodosPool({ user_id: isJwtValid.id })
        return todos
      } else {
        return Promise.resolve({
          error: "cannot authenticate jwt"
        })
      }
    }
  }
}

const getLoggedInTodos = getLoggedInTodosFactory({
  getTodos,
  verifyJwtFactory,
  jwt,
  secret: process.env.JWT_SECRET
})

const addLoggedInTodosFactory = (dependencies: IAddLoggedInTodosFactory) => {

  const {
    addTodo,
    verifyJwtFactory,
    jwt,
    secret } = dependencies

  return (pool: Pool) => {

    const addTodoPool = addTodo(pool)
    const verifyJwt = verifyJwtFactory({ jwt, secret })

    return async ({ todo, done }: { todo: string, done?: boolean }, { headers }: { headers: any }): Promise<ITodo | IAuthError> => {
      const isJwtValid = verifyJwt({ token: headers.auth_token })
      if (isJwtValid.success) {
        const createdTodo = await addTodoPool({ todo, done, user_id: isJwtValid.id })
        return createdTodo
      } else {
        return Promise.resolve({
          error: "cannot authenticate jwt"
        })
      }
    }
  }
}

const addLoggedInTodos = addLoggedInTodosFactory({
  addTodo,
  verifyJwtFactory,
  jwt,
  secret: process.env.JWT_SECRET
})

const getOneLoggedInTodoFactory = (dependencies: IGetOneLoggedInTodosFactory) => {

  const {
    getOneTodo,
    verifyJwtFactory,
    jwt,
    secret } = dependencies

  return (pool: Pool) => {
    const getOneTodoPool = getOneTodo(pool)
    const verifyJwt = verifyJwtFactory({ jwt, secret })

    return async ({ id }: { id: number }, { headers }: { headers: any }): Promise<ITodo | IAuthError> => {
      const isJwtValid = verifyJwt({ token: headers.auth_token })
      const user_id = isJwtValid.id
      if (isJwtValid.success) {
        const oneTodo = await getOneTodoPool({ id, user_id })
        return oneTodo
      } else {
        return Promise.resolve({
          error: "cannot authenticate jwt"
        })
      }
    }
  }
}

const getOneLoggedInTodo = getOneLoggedInTodoFactory({
  getOneTodo,
  verifyJwtFactory,
  jwt,
  secret: process.env.JWT_SECRET
})

const deleteLoggedInTodoFactory = (dependencies: IDeleteLoggedInTodosFactory) => {

  const {
    deleteTodo,
    verifyJwtFactory,
    jwt,
    secret } = dependencies

  return (pool: Pool) => {
    const deleteTodoPool = deleteTodo(pool)
    const verifyJwt = verifyJwtFactory({ jwt, secret })

    return async ({ id }: { id: number }, { headers }: { headers: any }): Promise<ITodo | IAuthError> => {
      const isJwtValid = verifyJwt({ token: headers.auth_token })
      const user_id = isJwtValid.id
      if (isJwtValid.success) {
        const oneTodo = await deleteTodoPool({ id, user_id })
        return oneTodo
      } else {
        return Promise.resolve({
          error: "cannot authenticate jwt"
        })
      }
    }
  }
}

const deleteLoggedInTodo = deleteLoggedInTodoFactory({
  deleteTodo,
  verifyJwtFactory,
  jwt,
  secret: process.env.JWT_SECRET
})

const editLoggedInTodoFactory = (dependencies: IEditLoggedInTodosFactory) => {

  const { 
    editTodo,
    verifyJwtFactory,
    jwt,
    secret } = dependencies
    
    return (pool: Pool) => {
      const editTodoPool = editTodo(pool)
      const verifyJwt = verifyJwtFactory({ jwt, secret })
    
    return async ({ id, todo, done }: { id: number, todo?: string, done?: boolean }, { headers }: { headers: any }): Promise<ITodo | IAuthError> => {
    const isJwtValid = verifyJwt({ token: headers.auth_token })
    const user_id = isJwtValid.id
    if (isJwtValid.success) {
      const oneTodo = await editTodoPool({ id, user_id, todo, done })
      return oneTodo
    } else {
      return Promise.resolve({
        error: "cannot authenticate jwt"
      })
    }
  }}
}

const editLoggedInTodo = editLoggedInTodoFactory({ 
  editTodo,
  verifyJwtFactory,
  jwt,
  secret: process.env.JWT_SECRET
})

export {
  addLoggedInTodos,
  addLoggedInTodosFactory,
  addTodo,
  createEditString,
  deleteLoggedInTodo,
  deleteLoggedInTodoFactory,
  deleteTodo,
  editLoggedInTodo,
  editLoggedInTodoFactory,
  editTodo,
  editTodoFactory,
  getLoggedInTodos,
  getLoggedInTodosFactory,
  getOneLoggedInTodo,
  getOneLoggedInTodoFactory,
  getOneTodo,
  getTodos,
}