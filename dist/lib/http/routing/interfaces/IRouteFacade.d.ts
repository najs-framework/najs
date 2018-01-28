import { RouteGrammarGroupChain, RouteGrammarNameChain, IRouteGrammarVerbs, IRouteGrammarControl } from './IRouteGrammars';
export interface IRouteFacade extends IRouteGrammarVerbs, IRouteGrammarControl {
    group(callback: () => void): RouteGrammarGroupChain;
    name(name: string): RouteGrammarNameChain;
}
