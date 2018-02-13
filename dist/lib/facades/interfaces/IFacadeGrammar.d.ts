import { IFacadeContainer } from './IFacadeContainer';
import * as Sinon from 'sinon';
export interface FacadeSpecs {
    (contextualFacade: IContextualFacade): IContextualFacadeMatcher<any>;
    <T>(contextualFacade: IContextualFacade): IContextualFacadeMatcher<T>;
    new (): IFacade;
    create<T>(container: IFacadeContainer, key: string, facadeInstanceCreator: () => void): IFacade & T;
    verifyMocks(): void;
    restoreAll(): void;
}
export interface IFacade {
    spy(method: string): Sinon.SinonSpy;
    createStub(method: string): Sinon.SinonStub;
    createMock(): Sinon.SinonMock;
    restoreFacade(): this;
    reloadFacadeRoot(): this;
}
export interface IContextualFacade {
}
export interface IContextualFacadeVerbOf<Action, Context> extends IContextualFacade {
    of(context: Context): Action;
}
export interface IContextualFacadeVerbWith<Action, Context> extends IContextualFacade {
    with(context: Context): Action;
}
export interface IContextualFacadeVerbFor<Action, Context> extends IContextualFacade {
    for(context: Context): Action;
}
export interface IContextualFacadeVerbAt<Action, Context> extends IContextualFacade {
    at(context: Context): Action;
}
export interface IContextualFacadeMatcher<Context> {
    with(context: Context): IFacade;
    withAny(): IFacade;
}
