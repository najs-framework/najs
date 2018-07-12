import 'jest'
import * as Sinon from 'sinon'
import * as Express from 'express'
import * as NajsBinding from 'najs-binding'
import * as Jest from '../../lib/test/jest'
import { FacadeContainer } from 'najs-facade'
import { TestSuite } from '../../lib/test/TestSuite'
import { isPromise } from '../../lib/private/isPromise'
import { HttpMethod } from '../../lib/http/HttpMethod'

describe('TestSuite', function() {
  describe('static .getFramework()', function() {
    it('simply returns TestSuite.najs framework instance if there is no params (getter)', function() {
      TestSuite['najs'] = <any>'anything'
      expect(TestSuite.getFramework()).toEqual('anything')

      TestSuite.clear()
    })
  })

  describe('static .setFramework()', function() {
    it('assigns the param to TestSuite.najs if there is an param, the startOptions is {createServer:false} by default', function() {
      const najs = {}
      expect(TestSuite.setFramework(<any>najs) === najs).toBe(true)
      expect(TestSuite['startOptions']).toEqual({ createServer: false })
      TestSuite.clear()
    })

    it('assigns the param to TestSuite.najs if there is an param with custom startOptions', function() {
      const najs = {}
      expect(TestSuite.setFramework(<any>najs, { createServer: true }) === najs).toBe(true)
      expect(TestSuite['startOptions']).toEqual({ createServer: true })
      TestSuite.clear()
    })
  })

  describe('static .clear()', function() {
    it('simply clears TestSuite.najs instance', function() {
      TestSuite['najs'] = <any>'anything'
      TestSuite.clear()
      expect(TestSuite['najs']).toBeUndefined()
    })
  })

  describe('static .runWithJest()', function() {
    it('calls .generateTestFromTestSuite() from jest and returns itself', function() {
      const generateTestFromTestSuiteStub = Sinon.stub(Jest, 'generateTestFromTestSuite')
      class Test extends TestSuite {}

      expect(TestSuite.runWithJest(Test) === TestSuite).toBe(true)
      expect(generateTestFromTestSuiteStub.calledWith(Test)).toBe(true)
      generateTestFromTestSuiteStub.restore()
    })
  })

  describe('static .jest()', function() {
    it('is an alias of .runWithJest()', function() {
      const runWithJestSpy = Sinon.spy(TestSuite, 'runWithJest')
      class Test extends TestSuite {}

      expect(TestSuite.jest(Test) === TestSuite).toBe(true)
      expect(runWithJestSpy.calledWith(Test)).toBe(true)
      runWithJestSpy.restore()
    })
  })

  describe('.setUp()', function() {
    it('does nothing and return undefined if the TestSuite.najs instance is undefined', function() {
      const testSuite = new TestSuite()
      expect(testSuite.setUp()).toBeUndefined()
    })

    it('does nothing and return undefined if the TestSuite.najs already started', function() {
      const najs = {
        isStarted() {
          return true
        }
      }
      TestSuite.setFramework(<any>najs)

      const testSuite = new TestSuite()
      expect(testSuite.setUp()).toBeUndefined()

      TestSuite.clear()
    })

    it('returns an promise with call TestSuite.najs.started() and resolve the nativeHttpDriver to this.nativeHttpDriver', async function() {
      const najs = {
        isStarted() {
          return false
        },

        start() {
          return new Promise(resolve => {
            resolve('anything')
          })
        },

        getNativeHttpDriver() {
          return 'nativeHttpDriver'
        }
      }
      TestSuite.setFramework(<any>najs)

      const testSuite = new TestSuite()
      const result = testSuite.setUp()
      expect(isPromise(result)).toBe(true)
      await result
      expect(testSuite['nativeHttpDriver']).toEqual('nativeHttpDriver')
    })
  })

  describe('.tearDown()', function() {
    it('is called after running test case', function() {})

    it('calls verifyAndRestoreFacades() from FacadeContainer', function() {
      const verifyAndRestoreAllFacadesSpy = Sinon.spy(FacadeContainer, 'verifyAndRestoreAllFacades')
      const testSuite = new TestSuite()
      testSuite.tearDown()
      expect(verifyAndRestoreAllFacadesSpy.called).toBe(true)
    })
  })

  describe('protected .createSuperTest()', function() {
    it('uses SuperTest to create an SuperTest instance wrap this.nativeHttpDriver', function() {
      const testSuite = new TestSuite()
      testSuite['nativeHttpDriver'] = Express()

      const result = testSuite['createSuperTest']()
      for (const name in HttpMethod) {
        const method = name === 'M_SEARCH' ? 'm-search' : name.toLowerCase()
        expect(typeof result[method]).toEqual('function')
      }
    })
  })

  describe('.call()', function() {
    it('calls .createSuperTest() to get the superTest instance then call [http-method] with url', function() {
      const testSuite = new TestSuite()
      const createSuperTestStub = Sinon.stub(testSuite, <any>'createSuperTest')
      const superTest = {
        get(url: string) {
          return 'get' + url
        },

        post(url: string) {
          return 'post' + url
        }
      }
      createSuperTestStub.returns(superTest)

      expect(testSuite.call('get', '/')).toEqual('get/')
      expect(testSuite.call('Get', '/')).toEqual('get/')
      expect(testSuite.call('GET', '/')).toEqual('get/')

      expect(testSuite.call('post', '/')).toEqual('post/')
      expect(testSuite.call('Post', '/')).toEqual('post/')
      expect(testSuite.call('POST', '/')).toEqual('post/')
    })

    it('flattens the SuperTestExpectation from 3rd params and call .injectExpectation(test)', function() {
      const testSuite = new TestSuite()
      const createSuperTestStub = Sinon.stub(testSuite, <any>'createSuperTest')
      const superTest = {
        get(url: string) {
          return 'get' + url
        }
      }
      const superTestExpectation = {
        injectExpectation(test: any) {
          return test
        }
      }
      const injectExpectationSpy = Sinon.spy(superTestExpectation, 'injectExpectation')
      createSuperTestStub.returns(superTest)

      expect(testSuite.call('get', '/', superTestExpectation, superTestExpectation, superTestExpectation)).toEqual(
        'get/'
      )
      expect(injectExpectationSpy.callCount).toEqual(3)
    })
  })

  describe('.get()', function() {
    it('simply passes param to .call with method "GET"', function() {
      const testSuite = new TestSuite()
      const callStub = Sinon.stub(testSuite, 'call')
      callStub.returns('anything')

      const expectations = ['b', 'c']
      expect(testSuite.get('/url', <any>'a', <any>expectations)).toBe('anything')
      expect(callStub.calledWith('GET', '/url', 'a', expectations)).toBe(true)
    })
  })

  describe('.expectJson()', function() {
    it('use make() to create an instance of Najs.Test.SuperTestExpectation.JsonExpectation', function() {
      const makeStub = Sinon.stub(NajsBinding, 'make')
      makeStub.returns('anything')

      const testSuite = new TestSuite()
      expect(testSuite.expectJson()).toEqual('anything')
      expect(makeStub.calledWith('Najs.Test.SuperTestExpectation.JsonExpectation')).toBe(true)

      const body = { a: 'any' }
      expect(testSuite.expectJson(body)).toEqual('anything')
      expect(makeStub.calledWith('Najs.Test.SuperTestExpectation.JsonExpectation', [body])).toBe(true)

      makeStub.restore()
    })
  })

  describe('Integration', function() {
    describe('.expectJson()', function() {
      it('should work with/without body', async function() {
        const testSuite = new TestSuite()
        const express = Express()
        testSuite['nativeHttpDriver'] = express

        const data = { a: 1, b: { c: 'test' } }
        express.get('/test/integration/expectJson', function(req: any, res: any) {
          return res.json(data)
        })

        await testSuite.get('/test/integration/expectJson', testSuite.expectJson())
        await testSuite.get('/test/integration/expectJson', testSuite.expectJson(data))
      })
    })
  })
})
