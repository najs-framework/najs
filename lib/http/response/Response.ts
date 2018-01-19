import { IResponse } from './IResponse'
import { JsonResponse } from './types/JsonResponse'
import { RedirectResponse } from './types/RedirectResponse'

export class Response {
  static json(value: any): IResponse {
    return new JsonResponse(value)
  }

  static redirect(url: string, status: number): IResponse {
    return new RedirectResponse(url, status)
  }
}
