import { IResponse } from './IResponse'
import { IResponseFacade } from './IResponseFacade'
import { JsonResponse } from './types/JsonResponse'
import { JsonpResponse } from './types/JsonpResponse'
import { RedirectResponse } from './types/RedirectResponse'

class Response implements IResponseFacade {
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

export const ResponseFacade: IResponseFacade = new Response()
