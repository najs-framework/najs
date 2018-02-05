import { Controller } from './Controller'
import { IRequestRetriever } from '../request/IRequestRetriever'
import { Request, Response } from 'express'

export abstract class ExpressController extends Controller<Request, Response> {
  protected body: IRequestRetriever
  protected query: IRequestRetriever
  protected params: IRequestRetriever
}
