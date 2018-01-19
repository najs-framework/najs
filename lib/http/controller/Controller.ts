import { IAutoload } from '../../core/IAutoload'

export abstract class Controller implements IAutoload {
  abstract getClassName(): string

  getDefaultRequestParser() {}
  getDefaultResponseHandler() {}
}
