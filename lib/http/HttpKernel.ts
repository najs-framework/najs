import { IMiddleware } from './middleware/IMiddleware'

export class HttpKernel {
  protected middlewareGroups: {
    [key: string]: string[]
  } = {}

  protected middleware: {
    [key: string]: string
  } = {}

  getMiddleware(name: string): IMiddleware | IMiddleware[] | undefined {
    // if (typeof this.middlewareGroups[name] === )
    return undefined
  }
}
