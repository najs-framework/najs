import { IRouteBuilder } from './interfaces/IRouteBuilder'
import { IRouteData } from './interfaces/IRouteData'
import {
  RouteGrammarGroupChain,
  RouteGrammarVerbChain,
  RouteGrammarNameChain,
  RouteGrammarControlChain,
  IRouteGrammarControl,
  IRouteGrammarGroup,
  IRouteGrammarNamed,
  IRouteGrammarVerbs
} from './interfaces/IRouteGrammars'

export class RouteBuilder
  implements IRouteBuilder, IRouteGrammarControl, IRouteGrammarGroup, IRouteGrammarNamed, IRouteGrammarVerbs {
  protected data: IRouteData
  protected children: Array<IRouteBuilder>

  constructor(method: string, path: string) {
    this.data = {
      name: '',
      method: method,
      path: path,
      prefix: '',
      controller: '',
      endpoint: '',
      middleware: []
    }
  }

  getRouteData(): IRouteData {
    return this.data
  }

  registerChildRoute(route: IRouteBuilder): void {
    if (this.children.length === 0) {
      this.children.push(route)
      return
    }

    const lastChild = this.children[this.children.length - 1]
    if (lastChild.shouldRegisterChildRoute()) {
      lastChild.registerChildRoute(route)
      return
    }

    this.children.push(route)
  }

  shouldRegisterChildRoute(): boolean {
    if (!this.data.metadata) {
      return false
    }
    return this.data.metadata['grouped'] === true
  }

  hasChildRoute(): boolean {
    return this.children.length === 0
  }

  // -------------------------------------------------------------------------------------------------------------------

  use(middleware: string): RouteGrammarControlChain {
    // this.data.middleware.push(middleware)
    return this
  }

  middleware(middleware: string): RouteGrammarControlChain {
    this.data.middleware.push(middleware)
    return this
  }

  prefix(prefix: string): RouteGrammarControlChain {
    this.data.prefix = prefix
    return this
  }

  group(callback: () => void): RouteGrammarGroupChain {
    if (!this.data.metadata) {
      this.data.metadata = {}
    }
    this.data.metadata['grouped'] = true
    callback.call(undefined)
    delete this.data.metadata['grouped']
    return this
  }

  name(name: string): RouteGrammarNameChain {
    this.data.name = name
    return this
  }

  get(path: string): RouteGrammarVerbChain {
    this.data.method = 'GET'
    this.data.path = path
    return this
  }

  // post(path: string): RouteGrammarVerbChain {
  //   this.data.method = 'POST'
  //   this.data.path = path
  //   return this
  // }

  protected httpVerb(method: string): RouteGrammarVerbChain {
    return this
  }
}
