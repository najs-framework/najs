import { IAutoload } from '../index'

export abstract class Controller implements IAutoload {
  abstract getClassName(): string

  getDefaultRequestParser() {}
  getDefaultResponseHandler() {}
}
