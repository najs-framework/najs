import { LoggerClass } from '../constants'
import { make } from '../core/make'
import { ILogger } from './ILogger'

export const Log: ILogger = make<ILogger>(LoggerClass)
