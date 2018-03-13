import { RouteGrammarGroupChain, RouteGrammarNameChain, IRouteGrammarVerbs, IRouteGrammarControl } from './IRouteGrammars';
export interface IRouteFactoryConstructor {
    new (): IRouteFactory;
}
export interface IRouteFactory extends IRouteGrammarVerbs, IRouteGrammarControl {
    group(callback: () => void): RouteGrammarGroupChain;
    name(name: string): RouteGrammarNameChain;
}
