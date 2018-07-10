import 'jest'
import * as Sinon from 'sinon'
import { FacadeContainer } from 'najs-facade'
import * as Jest from '../../lib/test/jest'
import { TestSuite } from '../../lib/test/TestSuite'
import { isPromise } from '../../lib/private/isPromise'

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
})
