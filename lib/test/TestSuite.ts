import { FacadeContainer } from 'najs-facade'
export class TestSuite {
  setUp() {}

  tearDown() {
    FacadeContainer.verifyAndRestoreAllFacades()
  }
}
