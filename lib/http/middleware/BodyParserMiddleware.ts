import { register } from 'najs-binding'
import { IExpressMiddleware } from './IExpressMiddleware'
import * as Express from 'express'
import * as BodyParser from 'body-parser'

export let JsonParser: Express.RequestHandler
export let UrlEncodedParser: Express.RequestHandler

export class BodyParserMiddleware implements IExpressMiddleware {
  static className: string = 'Najs.BodyParserMiddleware'

  constructor() {
    if (!JsonParser) {
      JsonParser = BodyParser.json()
    }
    if (!UrlEncodedParser) {
      UrlEncodedParser = BodyParser.urlencoded(this.getUrlEncodedOptions())
    }
  }

  protected getUrlEncodedOptions() {
    return { extended: true }
  }

  before(request: Express.Request, response: Express.Response) {
    return new Promise(function(resolve: any, reject: any) {
      JsonParser(request, response, function(error: any) {
        if (error) {
          return reject(error)
        }
        UrlEncodedParser(request, response, function(error: any) {
          if (error) {
            return reject(error)
          }
          return resolve()
        })
      })
    })
  }
}
register(BodyParserMiddleware)
