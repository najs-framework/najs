import * as SuperTest from 'supertest'

export type SuperTestExpectations = Array<ISuperTestExpectation | ISuperTestExpectation[]>

export interface ISuperTestExpectation {
  /**
   * Inject expectation to supertest instance
   *
   * @param {SuperTest.Test} test
   */
  injectExpectation(test: SuperTest.Test): SuperTest.Test
}
