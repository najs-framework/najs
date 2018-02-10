import 'jest'
import * as Make from '../../../lib/core/make'
import * as Sinon from 'sinon'
import { GlobalFacade } from '../../../lib/constants'
import { ConfigFacade } from '../../../lib/facades/global/ConfigFacade'

describe('ConfigFacade', function() {
  it('calls make() to create new instance of Application as a facade root', function() {
    const makeSpy = Sinon.spy(Make, 'make')
    ConfigFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(GlobalFacade.Config)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
