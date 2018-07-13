/// <reference types="najs-binding" />

import * as SuperTest from 'supertest'
import { Najs } from '../../constants'
import { register } from 'najs-binding'
import { ISuperTestExpectation } from './ISuperTestExpectation'

export class StatusExpectation implements Najs.Contracts.Autoload, ISuperTestExpectation {
  static className = Najs.Test.SuperTestExpectation.StatusExpectation
  protected status: any

  constructor(status: number) {
    this.status = status
  }

  getClassName() {
    return Najs.Test.SuperTestExpectation.StatusExpectation
  }

  injectExpectation(test: SuperTest.Test): SuperTest.Test {
    return test.expect(this.status)
  }
}
register(StatusExpectation, Najs.Test.SuperTestExpectation.StatusExpectation)
