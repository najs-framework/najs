import { register, IAutoload } from 'najs-binding'
import { ExpressMiddlewareBase } from '../ExpressMiddlewareBase'
import * as Express from 'express'
import * as BodyParser from 'body-parser'
import { ExpressController } from '../../controller/ExpressController'
import { HandlebarsHelper } from '../../../view/handlebars/HandlebarsHelper'
import { RequestDataReaderHandlebarsHelper } from '../../../view/handlebars/helpers/RequestDataReaderHandlebarsHelper'
import { HandlebarsViewResponse } from '../../../view/handlebars/HandlebarsViewResponse'

export class BodyParserMiddleware extends ExpressMiddlewareBase implements IAutoload {
  static className: string = 'Najs.BodyParserMiddleware'
  protected useJson: boolean
  protected useRaw: boolean
  protected useUrlEncoded: boolean
  protected useText: boolean

  getClassName() {
    return BodyParserMiddleware.className
  }

  parseParams(name: string, ...loaders: string[]) {
    this.useJson = false
    this.useUrlEncoded = false
    this.useRaw = false
    this.useText = false
    if (loaders.length === 0) {
      this.useJson = true
      this.useUrlEncoded = true
    }
    this.mapUsedLoaders(loaders)
  }

  protected mapUsedLoaders(loaders: string[]) {
    for (const name of loaders) {
      switch (name.toLocaleLowerCase()) {
        case 'json':
          this.useJson = true
          break
        case 'raw':
          this.useRaw = true
          break
        case 'urlencoded':
          this.useUrlEncoded = true
          break
        case 'text':
          this.useText = true
      }
    }
  }

  protected getJsonOptions() {
    return undefined
  }

  protected getRawOptions() {
    return undefined
  }

  protected getTextOptions() {
    return undefined
  }

  protected getUrlEncodedOptions() {
    return { extended: true }
  }

  createMiddleware(): Express.Handler | Express.Handler[] | undefined {
    const result = []
    if (this.useRaw) {
      result.push(BodyParser.raw(this.getRawOptions()))
    }
    if (this.useText) {
      result.push(BodyParser.text(this.getTextOptions()))
    }
    if (this.useJson) {
      result.push(BodyParser.json(this.getJsonOptions()))
    }
    if (this.useUrlEncoded) {
      result.push(BodyParser.urlencoded(this.getUrlEncodedOptions()))
    }
    return result.length > 0 ? result : undefined
  }

  async after(request: Express.Request, response: Express.Response, result: any, controller: ExpressController) {
    if (result instanceof HandlebarsViewResponse) {
      result.helper('Input', HandlebarsHelper.create(<any>RequestDataReaderHandlebarsHelper, controller, 'input'))
      result.helper('Body', HandlebarsHelper.create(<any>RequestDataReaderHandlebarsHelper, controller, 'body'))
      result.helper('Query', HandlebarsHelper.create(<any>RequestDataReaderHandlebarsHelper, controller, 'query'))
      result.helper('Params', HandlebarsHelper.create(<any>RequestDataReaderHandlebarsHelper, controller, 'params'))
    }
    return result
  }
}
register(BodyParserMiddleware)
