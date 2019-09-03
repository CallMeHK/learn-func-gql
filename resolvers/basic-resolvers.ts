export interface IGetId {
  id: number
}

export interface IAddStrings {
  str1: string,
  str2: string
}

export interface IAddStringsReturn {
  combined: string,
  str1: string,
  str2: string
}

const basicReducers = {
  hello: () => {
    return 'Hello world!';
  },
  getId: ({ id }: IGetId) => {
    return `id: ${id}`
  },
  addStrings: ({ str1, str2 }: IAddStrings): IAddStringsReturn => {
    return {
      combined: str1 + str2,
      str1,
      str2
    }
  }
}

export { basicReducers }