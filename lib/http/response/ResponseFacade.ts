import { IResponse } from './IResponse'
import { IResponseFacade } from './IResponseFacade'
import { JsonResponse } from './types/JsonResponse'
import { RedirectResponse } from './types/RedirectResponse'

class ResponseFacade implements IResponseFacade {
  json(value: any): IResponse {
    return new JsonResponse(value)
  }

  redirect(url: string): IResponse
  redirect(url: string, status: number): IResponse
  redirect(url: string, status: number = 302): IResponse {
    return new RedirectResponse(url, status)
  }
}

export const Response: IResponseFacade = new ResponseFacade()
