import * as Sinon from 'sinon'
import { IFacadeContainer } from './IFacadeContainer'

export interface FacadeSpecs {
  (facade: IFacadeBase): IFacade
  (contextualFacade: IContextualFacadeFactory): IContextualFacadeMatcher<any>
  <T>(contextualFacade: IContextualFacadeFactory): IContextualFacadeMatcher<T>
  new (): IFacade

  create<T>(container: IFacadeContainer, key: string, facadeInstanceCreator: () => void): IFacade & IFacadeBase & T
  create<T extends IContextualFacade<Context>, Context extends any>(
    createContextualFacade: (context: Context) => T
  ): IContextualFacadeFactoryFullVerbs<T, Context>

  verifyMocks(): void

  restoreAll(): void
}

export interface IFacadeBase {
  getFacade(): IFacade
}

export interface IFacade extends IFacadeBase {
  spy(method: string): Sinon.SinonSpy

  createStub(method: string): Sinon.SinonStub

  createMock(): Sinon.SinonMock

  shouldReceive(method: string): Sinon.SinonExpectation

  restoreFacade(): this

  reloadFacadeRoot(): this
}

export interface IContextualFacade<Context extends any> extends IFacade {
  context: Context
}

export interface IContextualFacadeFactory {}

export interface IContextualFacadeFactoryFullVerbs<Facade extends IContextualFacade<Context>, Context>
  extends IContextualFacadeFactory {
  of(context: Context): Facade
  with(context: Context): Facade
  for(context: Context): Facade
  at(context: Context): Facade
  from(context: Context): Facade
}

export interface IContextualFacadeVerbOf<Facade extends IContextualFacade<Context>, Context>
  extends IContextualFacadeFactory {
  of(context: Context): Facade
}

export interface IContextualFacadeVerbWith<Facade extends IContextualFacade<Context>, Context>
  extends IContextualFacadeFactory {
  with(context: Context): Facade
}

export interface IContextualFacadeVerbFor<Facade extends IContextualFacade<Context>, Context>
  extends IContextualFacadeFactory {
  for(context: Context): Facade
}

export interface IContextualFacadeVerbAt<Facade extends IContextualFacade<Context>, Context>
  extends IContextualFacadeFactory {
  at(context: Context): Facade
}

export interface IContextualFacadeVerbFrom<Facade extends IContextualFacade<Context>, Context>
  extends IContextualFacadeFactory {
  from(context: Context): Facade
}

export interface IContextualFacadeMatcher<Context> {
  with(context: Context): IFacade
  with(matcher: (context: Context) => boolean): IFacade

  withAny(): IFacade
}
