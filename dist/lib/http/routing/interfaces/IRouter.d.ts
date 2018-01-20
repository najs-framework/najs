import { RouteGrammarGroupChain, RouteGrammarNameChain, IRouteGrammarVerbs, IRouteGrammarControl } from './IRouteGrammars';
export interface IRouter extends IRouteGrammarVerbs, IRouteGrammarControl {
    group(callback: () => void): RouteGrammarGroupChain;
    name(name: string): RouteGrammarNameChain;
    redirect(...args: Array<any>): void;
}
