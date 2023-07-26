export interface UsersObservable {
  status: string,
  users: User[]
}

export interface UserObservable {
  status: string,
  user: User,
  token?: string
}

export interface User {
  _id?: string,
  email: string,
  password: string
}
