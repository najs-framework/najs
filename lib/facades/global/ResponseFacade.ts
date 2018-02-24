import '../../../lib/http/response/ResponseFactory'
import { Facade, IFacade, IFacadeBase } from 'najs-facade'
import { IResponseFactory } from '../../../lib/http/response/IResponseFactory'
import { Najs } from '../../../lib/core/Najs'
import { make } from 'najs-binding'
import { GlobalFacadeClass } from '../../constants'

const facade = Facade.create<IResponseFactory>(<any>Najs, 'response', function() {
  return make<IResponseFactory>(GlobalFacadeClass.Response)
})

export const Response: IResponseFactory & IFacadeBase = facade
export const ResponseFacade: IResponseFactory & IFacade = facade
