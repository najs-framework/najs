import 'jest'
import * as Make from '../../../lib/core/make'
import * as Sinon from 'sinon'
import { GlobalFacadeClass } from '../../../lib/constants'
import { PathFacade } from '../../../lib/facades/global/PathFacade'

describe('PathFacade', function() {
  it('calls make() to create new instance of Path as a facade root', function() {
    const makeSpy = Sinon.spy(Make, 'make')
    PathFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(GlobalFacadeClass.Path)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
