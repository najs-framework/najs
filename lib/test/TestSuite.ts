import { FacadeContainer } from './../facades/FacadeContainer'
export class TestSuite {
  setUp() {}

  tearDown() {
    FacadeContainer.verifyAndRestoreAllFacades()
  }
}
