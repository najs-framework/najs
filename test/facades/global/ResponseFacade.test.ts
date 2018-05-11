import 'jest'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { ResponseFacade } from '../../../lib/facades/global/ResponseFacade'

describe('ResponseFacade', function() {
  it('calls make() to create new instance of Response as a facade root', function() {
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    ResponseFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith('Najs.Http.ResponseFactory')).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
