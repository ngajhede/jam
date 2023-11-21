export enum Types {
  Stickynote = 'stickynote'
}

export type TItem = {
  id: string
  type: Types,
  content: string
  x: number
  y: number
}

export type TUser = {
  id: string
  name: string
}

export type TRoom = {
  id: string
  name: string
  items: TItem[]
  users: TUser[]
}
