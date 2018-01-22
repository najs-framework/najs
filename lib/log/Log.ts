import { LoggerClass } from './../constants'
import { make } from '../core/make'
import { ILogger } from './ILogger'

export let Log: ILogger = make<ILogger>(LoggerClass)
export function reload(): ILogger {
  Log = make<ILogger>(LoggerClass)
  return Log
}
