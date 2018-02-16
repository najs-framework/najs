import 'jest'
import * as Make from '../../../lib/core/make'
import * as Sinon from 'sinon'
import { GlobalFacadeClass } from '../../../lib/constants'
import { LogFacade } from '../../../lib/facades/global/LogFacade'

describe('LogFacade', function() {
  it('calls make() to create new instance of WinstonLogger as a facade root', function() {
    const makeSpy = Sinon.spy(Make, 'make')
    LogFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(GlobalFacadeClass.Log)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
