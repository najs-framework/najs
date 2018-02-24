import 'jest'
import * as Sinon from 'sinon'
import { FacadeContainer } from 'najs-facade'
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
      const verifyAndRestoreAllFacadesSpy = Sinon.spy(FacadeContainer, 'verifyAndRestoreAllFacades')
      const testSuite = new TestSuite()
      testSuite.tearDown()
      expect(verifyAndRestoreAllFacadesSpy.called).toBe(true)
    })
  })
})
