import 'jest'
import { RouteFacade } from '../../lib/http/routing/RouteFacade'
import * as Sinon from 'sinon'
import { route } from '../../lib/helpers/route'

describe('route()', function() {
  it('just an alias of Route.createByName()', function() {
    const routeFacadeCreateByNameStub = Sinon.stub(RouteFacade, <any>'createByName')
    route('test')
    expect(routeFacadeCreateByNameStub.calledWith('test')).toBe(true)
    route('test', {})
    expect(routeFacadeCreateByNameStub.calledWith('test', {})).toBe(true)
    route('test', { id: 123, name: 'any' })
    expect(routeFacadeCreateByNameStub.calledWith('test', { id: 123, name: 'any' })).toBe(true)

    const options = { encode: (v: string) => v }
    route('test', { id: 123, name: 'any' }, options)
    expect(routeFacadeCreateByNameStub.calledWith('test', { id: 123, name: 'any' }, options)).toBe(true)
    routeFacadeCreateByNameStub.restore()
  })
})
