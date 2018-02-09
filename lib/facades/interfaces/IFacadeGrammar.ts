export interface IFacade {
  spy(method: string): any
}

export interface IContextualFacade<Context> {
  with(context: Context): IFacade

  withAny(): IFacade
}

export interface IContextualFacadeFactory<Context> {
  (facade: IContextualFacadeVerb): IContextualFacade<Context>
}

export interface IContextualFacadeVerb {}

export interface IContextualFacadeVerbOf<Action, Context> extends IContextualFacadeVerb {
  of(context: Context): Action
}

export interface IContextualFacadeVerbWith<Action, Context> extends IContextualFacadeVerb {
  with(context: Context): Action
}

export interface IContextualFacadeVerbFor<Action, Context> extends IContextualFacadeVerb {
  for(context: Context): Action
}

export interface IContextualFacadeVerbAt<Action, Context> extends IContextualFacadeVerb {
  at(context: Context): Action
}
