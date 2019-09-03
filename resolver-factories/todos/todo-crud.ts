import { Pool } from 'pg'
import jwt from 'jsonwebtoken'
import { verifyJwtFactory } from '../identity/jwt-sign-verify'

export interface ITodosFactory {
  pool: Pool
}

export interface IEditTodosFactory {
  pool: Pool,
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
  pool: Pool,
  getTodosFactory: typeof getTodosFactory,
  verifyJwtFactory: typeof verifyJwtFactory,
  jwt: typeof jwt,
  secret: string
}

export interface IAddLoggedInTodosFactory {
  pool: Pool,
  addTodoFactory: typeof addTodoFactory,
  verifyJwtFactory: typeof verifyJwtFactory,
  jwt: typeof jwt,
  secret: string
}

export interface IGetOneLoggedInTodosFactory {
  pool: Pool,
  getOneTodoFactory: typeof getOneTodoFactory,
  verifyJwtFactory: typeof verifyJwtFactory,
  jwt: typeof jwt,
  secret: string
}

export interface IDeleteLoggedInTodosFactory {
  pool: Pool,
  deleteTodoFactory: typeof deleteTodoFactory,
  verifyJwtFactory: typeof verifyJwtFactory,
  jwt: typeof jwt,
  secret: string
}

export interface IEditLoggedInTodosFactory {
  pool: Pool,
  editTodoFactory: typeof editTodoFactory,
  createEditString: typeof createEditString,
  verifyJwtFactory: typeof verifyJwtFactory,
  jwt: typeof jwt,
  secret: string
}

const getTodosFactory = (dependencies: ITodosFactory) => {

  const { pool } = dependencies

  return async ({ user_id }: { user_id: number }): Promise<ITodos> => {
    const todosQuery = await pool.query(`SELECT * FROM todos WHERE user_id=${user_id}`)
    const todos = todosQuery.rows
    return { todos }
  }
}

const addTodoFactory = (dependencies: ITodosFactory) => {

  const { pool } = dependencies

  return async ({ todo, done, user_id }: { todo: string, done?: boolean, user_id: number }): Promise<ITodo> => {
    const todosQuery = await pool.query(`INSERT INTO todos (todo, done, user_id)
    VALUES ('${todo}', ${done}, ${user_id}) 
    RETURNING *`)
    return todosQuery.rows[0]
  }
}

const getOneTodoFactory = (dependencies: ITodosFactory) => {

  const { pool } = dependencies

  return async ({ id, user_id }: { id: number, user_id: number }): Promise<ITodo> => {
    const todosQuery = await pool.query(`SELECT * FROM todos 
    WHERE id=${id} AND user_id=${user_id}`)
    return todosQuery.rows[0]
  }
}

const deleteTodoFactory = (dependencies: ITodosFactory) => {
  
  const { pool } = dependencies
  
  return async ({ id, user_id }: { id: number, user_id: number }): Promise<ITodo> => {
    const todosQuery = await pool.query(`DELETE FROM todos 
    WHERE id=${id} AND user_id=${user_id}
    RETURNING *`)
    return todosQuery.rows[0]
  }
}

const createEditString = (edit: {todo?: string, done?:boolean}): string => {
  if(edit.todo && edit.done!==undefined){
    return `todo='${edit.todo}', done=${edit.done}`
  } else if(edit.todo){
    return `todo='${edit.todo}'`
  }
  return `done=${edit.done}`
}

const editTodoFactory = (dependencies: IEditTodosFactory) => {

  const { pool, createEditString } = dependencies

  return async ({ id, user_id, todo, done }: { id: number, user_id: number, todo?: string, done?:boolean }): Promise<ITodo> => {
    const editString = createEditString({todo, done})
    const todosQuery = await pool.query(`UPDATE todos 
    SET ${editString} 
    WHERE id=${id} AND user_id=${user_id}
    RETURNING *`)
    return todosQuery.rows[0]
  }
}

const getLoggedInTodosFactory = (dependencies: IGetLoggedInTodosFactory) => {

  const { pool,
    getTodosFactory,
    verifyJwtFactory,
    jwt,
    secret } = dependencies
  const getTodos = getTodosFactory({ pool })
  const verifyJwt = verifyJwtFactory({ secret, jwt })

  return async (__: any, { headers }: { headers: any }): Promise<ITodos | IAuthError> => {
    const isJwtValid = verifyJwt({ token: headers.auth_token })
    if (isJwtValid.success) {
      const todos = await getTodos({ user_id: isJwtValid.id })
      return todos
    } else {
      return Promise.resolve({
        error: "cannot authenticate jwt"
      })
    }
  }
}

const addLoggedInTodosFactory = (dependencies: IAddLoggedInTodosFactory) => {

  const { pool,
    addTodoFactory,
    verifyJwtFactory,
    jwt,
    secret } = dependencies
  const addTodo = addTodoFactory({ pool })
  const verifyJwt = verifyJwtFactory({ jwt, secret })

  return async ({ todo, done }: { todo: string, done?: boolean }, { headers }: { headers: any }): Promise<ITodo | IAuthError> => {
    const isJwtValid = verifyJwt({ token: headers.auth_token })
    if (isJwtValid.success) {
      const createdTodo = await addTodo({ todo, done, user_id: isJwtValid.id })
      return createdTodo
    } else {
      return Promise.resolve({
        error: "cannot authenticate jwt"
      })
    }
  }
}

const getOneLoggedInTodoFactory = (dependencies: IGetOneLoggedInTodosFactory) => {

  const { pool,
    getOneTodoFactory,
    verifyJwtFactory,
    jwt,
    secret } = dependencies
  const getOneTodo = getOneTodoFactory({ pool })
  const verifyJwt = verifyJwtFactory({ jwt, secret })

  return async ({ id }: { id: number }, { headers }: { headers: any }): Promise<ITodo | IAuthError> => {
    const isJwtValid = verifyJwt({ token: headers.auth_token })
    const user_id = isJwtValid.id
    if (isJwtValid.success) {
      const oneTodo = await getOneTodo({ id, user_id })
      return oneTodo
    } else {
      return Promise.resolve({
        error: "cannot authenticate jwt"
      })
    }
  }
}

const deleteLoggedInTodoFactory = (dependencies: IDeleteLoggedInTodosFactory) => {

  const { pool,
    deleteTodoFactory,
    verifyJwtFactory,
    jwt,
    secret } = dependencies
  const deleteTodo = deleteTodoFactory({ pool })
  const verifyJwt = verifyJwtFactory({ jwt, secret })

  return async ({ id }: { id: number }, { headers }: { headers: any }): Promise<ITodo | IAuthError> => {
    const isJwtValid = verifyJwt({ token: headers.auth_token })
    const user_id = isJwtValid.id
    if (isJwtValid.success) {
      const oneTodo = await deleteTodo({ id, user_id })
      return oneTodo
    } else {
      return Promise.resolve({
        error: "cannot authenticate jwt"
      })
    }
  }
}

const editLoggedInTodoFactory = (dependencies: IEditLoggedInTodosFactory) => {

  const { pool,
    editTodoFactory,
    verifyJwtFactory,
    createEditString,
    jwt,
    secret } = dependencies
  const editTodo = editTodoFactory({ pool, createEditString })
  const verifyJwt = verifyJwtFactory({ jwt, secret })

  return async ({ id, todo, done }: { id: number, todo?: string, done?: boolean }, { headers }: { headers: any }): Promise<ITodo | IAuthError> => {
    const isJwtValid = verifyJwt({ token: headers.auth_token })
    const user_id = isJwtValid.id
    if (isJwtValid.success) {
      const oneTodo = await editTodo({ id, user_id, todo, done })
      return oneTodo
    } else {
      return Promise.resolve({
        error: "cannot authenticate jwt"
      })
    }
  }
}

export {
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
}