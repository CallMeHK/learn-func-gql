import { useState, useEffect, useCallback } from 'react'
import { request } from 'graphql-request'
 

export interface IUseGqlState<T> {
  loading: boolean,
  data: null | T
}

type IUseGqlHook = <T extends {}>(query: string) => IUseGqlState<T>

const gql = async <T extends {}>(query: string): Promise<T> => {
  const url = `/graphql`
  const response = await request(url, query)
  return response as T
}

const useGql: IUseGqlHook = <T>(query: string) => {
  const [ state, setState ] = useState<IUseGqlState<T>>({
    loading:true,
    data:null
  })

  const makeQuery = useCallback(async () => {
    const response = await gql<T>(query)
    console.log(response)
    setState({
      loading: false, 
      data: response
    })
  }, [setState])


  useEffect(() => {
    makeQuery()
  },[])

  return state
}

type IUseGqlCallbackHook = <T, C>(query: string, callback: C) => () => void

const useGqlCallback = <T>(query: string, callback: (response: T) => void): (() => void) => {
  const makeQuery = useCallback(async () => {
    const response = await gql<T>(query)
    callback(response)
  }, [query, callback])
  return makeQuery
}



export { gql, useGql, useGqlCallback }