import {
  RouteGrammarGroupChain,
  RouteGrammarNameChain,
  IRouteGrammarVerbs,
  IRouteGrammarControl
} from './IRouteGrammars'

export interface IRouteFactory extends IRouteGrammarVerbs, IRouteGrammarControl {
  group(callback: () => void): RouteGrammarGroupChain

  name(name: string): RouteGrammarNameChain

  // redirect(...args: Array<any>): void
}
