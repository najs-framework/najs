import { IView } from './types/IViewGrammars'
import { IResponse } from './IResponse'

export interface IResponseFacade {
  view(view: string): IView
  view<T extends Object = {}>(view: string, variables: T): IView

  json(value: any): IResponse

  jsonp(value: any): IResponse

  redirect(url: string): IResponse
  redirect(url: string, status: number): IResponse
}
