import { verifyAndRestoreFacades } from './../facades/FacadeContainer'
export class TestSuite {
  setUp() {}

  tearDown() {
    verifyAndRestoreFacades()
  }
}
