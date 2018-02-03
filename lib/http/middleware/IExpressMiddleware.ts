import { ExpressHttpDriver } from '../driver/ExpressHttpDriver'
import { IMiddleware } from './IMiddleware'
import * as Express from 'express'

export interface IExpressMiddleware extends IMiddleware {
  native?(driver: ExpressHttpDriver): any
  before?(request: Express.Request, response: Express.Response): Promise<any>
  after?(request: Express.Request, response: Express.Response, result: any): Promise<any>
}
