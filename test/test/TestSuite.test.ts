import 'jest'
import * as Sinon from 'sinon'
import * as FacadeContainer from '../../lib/facades/FacadeContainer'
import { TestSuite } from '../../lib/test/TestSuite'

describe('TestSuite', function() {
  describe('.setUp()', function() {
    it('is called before running test case', function() {
      const testSuite = new TestSuite()
      testSuite.setUp()
    })
  })

  describe('.tearDown()', function() {
    it('is called after running test case', function() {})

    it('calls verifyAndRestoreFacades() from FacadeContainer', function() {
      const verifyAndRestoreFacadesSpy = Sinon.spy(FacadeContainer, 'verifyAndRestoreFacades')
      const testSuite = new TestSuite()
      testSuite.tearDown()
      expect(verifyAndRestoreFacadesSpy.called).toBe(true)
    })
  })
})
