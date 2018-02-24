import { IRequestDataReader } from '../request/IRequestDataReader'
import { IRequestDataWriter } from '../request/IRequestDataWriter'

export interface ISession extends IRequestDataReader, IRequestDataWriter {}

export interface ISessionFunctions {
  regenerate(): string

  flash(): this

  keep(): this
}
