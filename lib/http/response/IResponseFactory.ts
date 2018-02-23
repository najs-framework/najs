import { IView } from './types/IViewGrammars'
import { IResponse } from './IResponse'

export interface IResponseFactory {
  view(view: string): IView
  view<T extends Object = {}>(view: string, variables: T): IView

  json(value: any): IResponse

  jsonp(value: any): IResponse

  redirect(url: string): IResponse
  redirect(url: string, status: number): IResponse

  back(): IResponse
  back(defaultUrl: string): IResponse
}
