import {
  RouteGrammarVerbChain,
  RouteGrammarGroupChain,
  RouteGrammarControlChain,
  RouteGrammarNameChain
} from './IRouteGrammars'

export interface IRouter {
  group(callback: () => void): RouteGrammarGroupChain

  use(middleware: string): RouteGrammarControlChain

  middleware(middleware: string): RouteGrammarControlChain

  prefix(prefix: string): RouteGrammarControlChain

  get(path: string, endpoint: string): RouteGrammarVerbChain

  name(name: string): RouteGrammarNameChain

  redirect(...args: Array<any>): void
}
