/// <reference path="../contracts/types/http.ts" />

import './supertest/JsonExpectation'
import * as SuperTest from 'supertest'
import { INajs } from '../core/INajs'
import { FacadeContainer } from 'najs-facade'
import { generateTestFromTestSuite } from './jest'
import { flatten } from 'lodash'
import { SuperTestExpectations, ISuperTestExpectation } from './supertest/ISuperTestExpectation'
import { make } from 'najs-binding'
import { Najs as NajsClasses } from '../constants'

export class TestSuite {
  protected static najs: INajs | undefined
  protected static startOptions: Najs.Http.StartOptions
  protected nativeHttpDriver: any

  static getFramework(): INajs | undefined {
    return this.najs
  }

  static setFramework(najs: INajs, startOptions: Najs.Http.StartOptions = { createServer: false }): INajs | undefined {
    this.najs = najs
    this.startOptions = startOptions
    return this.najs
  }

  static clear() {
    this.najs = undefined
  }

  static runWithJest(testSuite: typeof TestSuite): typeof TestSuite {
    generateTestFromTestSuite(testSuite)

    return TestSuite
  }

  static jest(testSuite: typeof TestSuite): typeof TestSuite {
    return this.runWithJest(testSuite)
  }

  // -------------------------------------------------------------------------------------------------------------------

  setUp() {
    if (typeof TestSuite.najs === 'undefined' || TestSuite.najs.isStarted()) {
      return
    }

    return new Promise(resolve => {
      TestSuite.najs!.start(TestSuite.startOptions).then(() => {
        this.nativeHttpDriver = TestSuite.najs!.getNativeHttpDriver()
        resolve()
      })
    })
  }

  tearDown() {
    FacadeContainer.verifyAndRestoreAllFacades()
  }

  // -------------------------------------------------------------------------------------------------------------------

  protected createSuperTest(): SuperTest.SuperTest<SuperTest.Test> {
    return SuperTest(this.nativeHttpDriver)
  }

  call(method: string | Najs.Http.HttpMethod, url: string, ...assertions: SuperTestExpectations): SuperTest.Test {
    let test: SuperTest.Test = this.createSuperTest()[method.toLowerCase()](url)
    const expectations = flatten(assertions)
    for (const expectation of expectations) {
      test = expectation.injectExpectation(test)
    }
    return test
  }

  get(url: string, ...assertions: SuperTestExpectations) {
    return this.call('GET', url, ...assertions)
  }

  expectJson(body?: any): ISuperTestExpectation {
    return make(NajsClasses.Test.SuperTestExpectation.JsonExpectation, [body])
  }

  // -------------------------------------------------------------------------------------------------------------------
}
