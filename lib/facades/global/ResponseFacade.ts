import '../../../lib/http/response/ResponseFactory'
import { Facade } from '../Facade'
import { IFacade } from '../interfaces/IFacadeGrammar'
import { IResponseFactory } from '../../../lib/http/response/IResponseFactory'
import { Najs } from '../../../lib/core/Najs'
import { make } from '../../../lib/core/make'
import { GlobalFacade } from '../../constants'

export const ResponseFacade: IResponseFactory & IFacade = Facade.create<IResponseFactory>(Najs, 'response', function() {
  return make<IResponseFactory>(GlobalFacade.Response)
})
