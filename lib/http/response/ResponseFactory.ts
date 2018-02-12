import { IAutoload } from './../../core/IAutoload'
import { Facade } from './../../facades/Facade'
import { GlobalFacade } from '../../constants'
import { IView } from './types/IViewGrammars'
import { ViewResponse } from './types/ViewResponse'
import { IResponse } from './IResponse'
import { IResponseFactory } from './IResponseFactory'
import { JsonResponse } from './types/JsonResponse'
import { JsonpResponse } from './types/JsonpResponse'
import { RedirectResponse } from './types/RedirectResponse'
import { register } from '../../core/register'

export class ResponseFactory extends Facade implements IResponseFactory, IAutoload {
  static className: string = GlobalFacade.Response

  getClassName() {
    return GlobalFacade.Response
  }

  view(view: string): IView
  view<T extends Object = {}>(view: string, variables: T): IView
  view<T extends Object = {}>(view: string, variables?: T): IView {
    return new ViewResponse(view, <any>variables)
  }

  json(value: any): IResponse {
    return new JsonResponse(value)
  }

  jsonp(value: any): IResponse {
    return new JsonpResponse(value)
  }

  redirect(url: string): IResponse
  redirect(url: string, status: number): IResponse
  redirect(url: string, status: number = 302): IResponse {
    return new RedirectResponse(url, status)
  }
}
register(ResponseFactory)
