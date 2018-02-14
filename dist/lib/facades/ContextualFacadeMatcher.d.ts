import { IFacade } from './interfaces/IFacadeGrammar';
import { FacadeContainer } from './FacadeContainer';
import { ContextualFacadeFactory } from './ContextualFacadeFactory';
export declare const ContextualFacadeContainer: FacadeContainer;
export declare class ContextualFacadeMatcher {
    count: number;
    factory: ContextualFacadeFactory;
    createContextualFacade: any;
    constructor(contextualFacade: ContextualFacadeFactory);
    boundCreateByContext(context: any): any;
    with(context: any): IFacade;
}
