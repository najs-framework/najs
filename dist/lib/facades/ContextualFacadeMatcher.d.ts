import { IFacade } from './interfaces/IFacadeGrammar';
import { FacadeContainer } from './FacadeContainer';
import { ContextualFacadeFactory } from './ContextualFacadeFactory';
export declare const ContextualFacadeContainer: FacadeContainer;
export declare class ContextualFacadeMatcher {
    count: number;
    factory: ContextualFacadeFactory<any, any>;
    createContextualFacade: any;
    constructor(contextualFacadeFactory: ContextualFacadeFactory<any, any>);
    boundCreateByContext(context: any): any;
    with(context: any): IFacade;
}
