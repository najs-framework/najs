import { Controller } from './Controller'
import { Request, Response } from 'express'

export abstract class ExpressController extends Controller<Request, Response> {}
