import { FacadeContainersBag, cleanFacadeContainersBag } from './../facades/FacadeContainer'
export class TestSuite {
  setUp() {}

  tearDown() {
    for (const container of FacadeContainersBag) {
      container.verifyMocks()
    }

    for (const container of FacadeContainersBag) {
      container.restoreFacades()
    }

    cleanFacadeContainersBag()
  }
}
