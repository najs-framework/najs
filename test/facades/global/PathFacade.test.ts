import 'jest'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { Najs } from '../../../lib/constants'
import { PathFacade } from '../../../lib/facades/global/PathFacade'

describe('PathFacade', function() {
  it('calls make() to create new instance of Path as a facade root', function() {
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    PathFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(Najs.FileSystem.Path)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
