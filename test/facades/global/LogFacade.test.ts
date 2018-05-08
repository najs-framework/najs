import 'jest'
import * as NajsBinding from 'najs-binding'
import * as Sinon from 'sinon'
import { Najs } from '../../../lib/constants'
import { LogFacade } from '../../../lib/facades/global/LogFacade'

describe('LogFacade', function() {
  it('calls make() to create new instance of WinstonLogger as a facade root', function() {
    const makeSpy = Sinon.spy(NajsBinding, 'make')
    LogFacade.reloadFacadeRoot()
    expect(makeSpy.calledWith(Najs.Log.WinstonLogger)).toBe(true)
    expect(makeSpy.calledOnce).toBe(true)
  })
})
