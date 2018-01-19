import { RouteGrammarVerbChain, RouteGrammarGroupChain, RouteGrammarControlChain, RouteGrammarNameChain } from './interfaces/IRouteGrammars';
export declare class Router {
    group(callback: () => void): RouteGrammarGroupChain;
    use(middleware: string): RouteGrammarControlChain;
    middleware(middleware: string): RouteGrammarControlChain;
    prefix(prefix: string): RouteGrammarControlChain;
    get(path: string, endpoint: string): RouteGrammarVerbChain;
    name(name: string): RouteGrammarNameChain;
    redirect(...args: Array<any>): void;
    private register<T>(route);
}
