export declare type RouteGrammarControlChain = IRouteGrammarControl & IRouteGrammarGroup & IRouteGrammarVerbs & IRouteGrammarNamed;
export declare type RouteGrammarControlNoVerbChain = IRouteGrammarControlOnly & IRouteGrammarNamedNoVerb;
export declare type RouteGrammarGroupChain = IRouteGrammarControlOnly;
export declare type RouteGrammarVerbChain = IRouteGrammarControlNoVerb & IRouteGrammarNamedNoVerb;
export declare type RouteGrammarNameChain = IRouteGrammarControlOnly & IRouteGrammarVerbs;
export declare type RouteGrammarNameChainNoVerb = IRouteGrammarControlOnly;
export interface IRouteGrammarControl {
    use(middleware: string): RouteGrammarControlChain;
    middleware(middleware: string): RouteGrammarControlChain;
    prefix(prefix: string): RouteGrammarControlChain;
}
export interface IRouteGrammarControlNoVerb {
    use(middleware: string): RouteGrammarControlNoVerbChain;
    middleware(middleware: string): RouteGrammarControlNoVerbChain;
    prefix(prefix: string): RouteGrammarControlNoVerbChain;
}
export interface IRouteGrammarControlOnly {
    use(middleware: string): IRouteGrammarControlOnly;
    middleware(middleware: string): IRouteGrammarControlOnly;
    prefix(prefix: string): IRouteGrammarControlOnly;
}
export interface IRouteGrammarGroup {
    group(callback: () => void): RouteGrammarGroupChain;
}
export interface IRouteGrammarVerbs {
    get(path: string, endpoint: string): RouteGrammarVerbChain;
}
export interface IRouteGrammarNamed {
    name(name: string): RouteGrammarNameChain;
}
export interface IRouteGrammarNamedNoVerb {
    name(name: string): RouteGrammarNameChainNoVerb;
}
