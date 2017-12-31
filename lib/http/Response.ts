import { IResponse } from './IResponse'
import { JsonResponse } from './response-types/JsonResponse'
import { RedirectResponse } from './response-types/RedirectResponse'

export class Response {
  static json(value: any): IResponse {
    return new JsonResponse(value)
  }

  static redirect(url: string, status: number): IResponse {
    return new RedirectResponse(url, status)
  }
}
