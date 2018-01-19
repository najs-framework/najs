import { IRouteBuilder } from './interfaces/IRouteBuilder';
import { IRouteData } from './interfaces/IRouteData';
import { RouteGrammarGroupChain, RouteGrammarVerbChain, RouteGrammarNameChain, RouteGrammarControlChain, IRouteGrammarControl, IRouteGrammarGroup, IRouteGrammarNamed, IRouteGrammarVerbs } from './interfaces/IRouteGrammars';
export declare class RouteBuilder implements IRouteBuilder, IRouteGrammarControl, IRouteGrammarGroup, IRouteGrammarNamed, IRouteGrammarVerbs {
    protected data: IRouteData;
    protected children: Array<IRouteBuilder>;
    constructor(method: string, path: string);
    getRouteData(): IRouteData;
    registerChildRoute(route: IRouteBuilder): void;
    shouldRegisterChildRoute(): boolean;
    hasChildRoute(): boolean;
    use(middleware: string): RouteGrammarControlChain;
    middleware(middleware: string): RouteGrammarControlChain;
    prefix(prefix: string): RouteGrammarControlChain;
    group(callback: () => void): RouteGrammarGroupChain;
    name(name: string): RouteGrammarNameChain;
    get(path: string): RouteGrammarVerbChain;
    protected httpVerb(method: string): RouteGrammarVerbChain;
}
