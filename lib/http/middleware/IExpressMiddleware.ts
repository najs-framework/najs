import { ExpressHttpDriver } from '../driver/ExpressHttpDriver'
import { IMiddleware } from './IMiddleware'
import { ExpressController } from '../controller/ExpressController'
import * as Express from 'express'

export type ExpressNativeMiddleware = (
  request: Express.Response,
  response: Express.Response,
  next: Express.NextFunction
) => void

export interface IExpressMiddleware extends IMiddleware {
  native?(driver: ExpressHttpDriver): ExpressNativeMiddleware | ExpressNativeMiddleware[] | undefined
  before?(request: Express.Request, response: Express.Response, controller: ExpressController): Promise<any>
  after?(request: Express.Request, response: Express.Response, result: any, controller: ExpressController): Promise<any>
}
