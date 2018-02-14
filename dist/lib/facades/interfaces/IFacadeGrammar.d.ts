import * as Sinon from 'sinon';
import { IFacadeContainer } from './IFacadeContainer';
export interface FacadeSpecs {
    (facade: IFacadeBase): IFacade;
    (contextualFacade: IContextualFacade): IContextualFacadeMatcher<any>;
    new (): IFacade;
    create<T>(container: IFacadeContainer, key: string, facadeInstanceCreator: () => void): IFacade & IFacadeBase & T;
    verifyMocks(): void;
    restoreAll(): void;
}
export interface IFacadeBase {
    getFacade(): IFacade;
}
export interface IFacade extends IFacadeBase {
    spy(method: string): Sinon.SinonSpy;
    createStub(method: string): Sinon.SinonStub;
    createMock(): Sinon.SinonMock;
    shouldReceive(method: string): Sinon.SinonExpectation;
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
