export interface FacadeSpecs {
  (contextualFacade: IContextualFacade): IContextualFacadeMatcher<any>
  <T>(contextualFacade: IContextualFacade): IContextualFacadeMatcher<T>
  new (container?: Object): IFacade
}

export interface IFacade {
  spy(method: string): any
}

export interface IContextualFacade {}

export interface IContextualFacadeVerbOf<Action, Context> extends IContextualFacade {
  of(context: Context): Action
}

export interface IContextualFacadeVerbWith<Action, Context> extends IContextualFacade {
  with(context: Context): Action
}

export interface IContextualFacadeVerbFor<Action, Context> extends IContextualFacade {
  for(context: Context): Action
}

export interface IContextualFacadeVerbAt<Action, Context> extends IContextualFacade {
  at(context: Context): Action
}

export interface IContextualFacadeMatcher<Context> {
  with(context: Context): IFacade

  withAny(): IFacade
}
