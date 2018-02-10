import 'jest'
import * as Make from '../../../lib/core/make'
import * as Sinon from 'sinon'
import { GlobalFacade } from '../../../lib/constants'
import { AppFacade } from '../../../lib/facades/global/AppFacade'

describe('AppFacade', function() {
  it('calls make() to create new instance of Application as a facade root', function() {
    const makeSpy = Sinon.spy(Make, 'make')
    AppFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(GlobalFacade.Application)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
