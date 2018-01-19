/*
 * The purpose of this interface is create a grammar for Route, it affects nothing to implementation side
 * This file has test in ~/syntax/Routing.ts, if something went wrong errors will come out from build phase
 *
 * There are some rules:
 *   - Could not chain HTTP methods after using .group()
 *   - Could not chain group() after using .name()
 *   - Could not chain group() after using .name()
 */

export type RouteGrammarControlChain = IRouteGrammarControl &
  IRouteGrammarGroup &
  IRouteGrammarVerbs &
  IRouteGrammarNamed

export type RouteGrammarControlNoVerbChain = IRouteGrammarControlOnly & IRouteGrammarNamedNoVerb

export type RouteGrammarGroupChain = IRouteGrammarControlOnly
export type RouteGrammarVerbChain = IRouteGrammarControlNoVerb & IRouteGrammarNamedNoVerb
export type RouteGrammarNameChain = IRouteGrammarControlOnly & IRouteGrammarVerbs
export type RouteGrammarNameChainNoVerb = IRouteGrammarControlOnly

export interface IRouteGrammarControl {
  use(middleware: string): RouteGrammarControlChain

  middleware(middleware: string): RouteGrammarControlChain

  prefix(prefix: string): RouteGrammarControlChain
}

export interface IRouteGrammarControlNoVerb {
  use(middleware: string): RouteGrammarControlNoVerbChain

  middleware(middleware: string): RouteGrammarControlNoVerbChain

  prefix(prefix: string): RouteGrammarControlNoVerbChain
}

export interface IRouteGrammarControlOnly {
  use(middleware: string): IRouteGrammarControlOnly

  middleware(middleware: string): IRouteGrammarControlOnly

  prefix(prefix: string): IRouteGrammarControlOnly
}

export interface IRouteGrammarGroup {
  group(callback: () => void): RouteGrammarGroupChain
}

export interface IRouteGrammarVerbs {
  get(path: string, endpoint: string): RouteGrammarVerbChain
}

export interface IRouteGrammarNamed {
  name(name: string): RouteGrammarNameChain
}

export interface IRouteGrammarNamedNoVerb {
  name(name: string): RouteGrammarNameChainNoVerb
}
