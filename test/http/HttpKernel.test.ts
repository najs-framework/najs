import 'jest'
import * as Sinon from 'sinon'
import * as NajsBinding from 'najs-binding'
import { ClassRegistry } from 'najs-binding'
import { HttpKernel } from '../../lib/http/HttpKernel'
import { SystemClass } from '../../lib/constants'

describe('HttpKernel', function() {
  it('is a base class which contains middleware configuration', function() {})

  it('auto register to ClassRegistry with name HttpKernel', function() {
    expect(ClassRegistry.has(SystemClass.HttpKernel)).toBe(true)

    const instance = new HttpKernel()
    expect(instance.getClassName() === SystemClass.HttpKernel)
  })

  describe('getMiddleware()', function() {
    it('returns empty array if middleware not found', function() {
      const instance = new HttpKernel()
      expect(instance.getMiddleware('not-found')).toEqual([])
    })

    it('calls make() and push middleware to result if middleware instance is exists', function() {
      const middleware = {}
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.returns(middleware)

      const instance = new HttpKernel()
      instance['middleware']['test'] = 'something'
      const result = instance.getMiddleware('test')
      expect(result).toHaveLength(1)
      expect(result[0] === middleware).toBe(true)
      expect(makeStub.calledWith('something'))
      makeStub.restore()
    })

    it('calls make() and does not push middleware to result if middleware instance not exists', function() {
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.returns(undefined)

      const instance = new HttpKernel()
      instance['middleware']['test'] = 'something'
      const result = instance.getMiddleware('test')
      expect(result).toHaveLength(0)
      expect(makeStub.calledWith('something'))
      makeStub.restore()
    })

    it('maps all if the middleware is an array, does the same thing as string param', function() {
      const middleware = {}
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.withArgs('something').returns(middleware)
      makeStub.withArgs('not-found').returns(undefined)

      const instance = new HttpKernel()
      instance['middleware']['test'] = ['something', 'not-found']
      const result = instance.getMiddleware('test')
      expect(result).toHaveLength(1)
      expect(result[0] === middleware).toBe(true)
      expect(makeStub.calledWith('something'))
      makeStub.restore()
    })
  })
})
