import 'jest'
import * as Make from '../../../lib/core/make'
import * as Sinon from 'sinon'
import { GlobalFacadeClass } from '../../../lib/constants'
import { CacheFacade } from '../../../lib/facades/global/CacheFacade'

describe('CacheFacade', function() {
  it('calls make() to create new instance of RedisCache as a facade root', function() {
    const makeSpy = Sinon.spy(Make, 'make')
    CacheFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(GlobalFacadeClass.Cache)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
