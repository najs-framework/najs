import 'jest'
import { TestSuite } from '../../lib/test/TestSuite'

describe('TestSuite', function() {
  describe('.setUp()', function() {
    it('is called before running test case', function() {
      const testSuite = new TestSuite()
      testSuite.setUp()
    })
  })

  describe('.tearDown()', function() {
    it('is called after running test case', function() {
      const testSuite = new TestSuite()
      testSuite.tearDown()
    })
  })
})
