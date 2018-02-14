import 'jest'
import * as Sinon from 'sinon'
import { ContextualFacadeFactory } from '../../lib/facades/ContextualFacadeFactory'

describe('ContextualFacadeFactory', function() {
  it('is created with a createContextualFacade function', function() {
    const creator = (context: any): any => {}
    const factory = new ContextualFacadeFactory(creator)
    expect(factory.contextualFacadeCreator === creator).toBe(true)
  })

  const verbs = ['of', 'with', 'for', 'at', 'from']
  for (const verb of verbs) {
    describe('.' + verb + '()', function() {
      it('just calls contextualFacadeCreator and passes a context', function() {
        const creator = (context: any): any => {}
        const factory = new ContextualFacadeFactory(creator)
        const contextualFacadeCreatorSpy = Sinon.spy(factory, 'contextualFacadeCreator')
        factory[verb]('anything')
        expect(contextualFacadeCreatorSpy.calledWith('anything')).toBe(true)
      })
    })
  }
})
