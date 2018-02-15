import { IFacade } from './interfaces/IFacadeGrammar';
import { FacadeContainer } from './FacadeContainer';
import { ContextualFacadeFactory } from './ContextualFacadeFactory';
export declare class ContextualFacadeMatcher {
    count: number;
    container: FacadeContainer;
    factory: ContextualFacadeFactory<any, any>;
    createContextualFacade: any;
    constructor(contextualFacadeFactory: ContextualFacadeFactory<any, any>);
    boundCreateByContext(context: any): any;
    createMatcher(matcher: Function): any;
    with(context: any): IFacade;
    with(matcher: (context: any) => boolean): IFacade;
    withAny(): IFacade;
}
