import 'jest'
import { TestSuite } from './TestSuite'

export function jest(group: string = 'test') {
  return function decorator(Target: any) {
    generateTestFromTestSuite(Target)
  }
}

export function generateTestFromTestSuite(suite: typeof TestSuite) {
  const functions = Object.getOwnPropertyNames(suite.prototype)
  const tests: string[] = []
  for (const name of functions) {
    if (name === 'constructor' || name.indexOf('test') !== 0) {
      continue
    }
    tests.push(name)
  }

  const instance: TestSuite = Reflect.construct(suite, [])
  describe(suite.name, function() {
    beforeEach(instance.setUp.bind(instance))
    afterEach(instance.tearDown.bind(instance))

    for (const testName of tests) {
      it(testName, instance[testName].bind(instance))
    }
  })
}
