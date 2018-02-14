import { FacadeContainers } from './../facades/Facade'
export class TestSuite {
  setUp() {}

  tearDown() {
    for (const container of FacadeContainers) {
      container.verifyMocks()
    }

    for (const container of FacadeContainers) {
      container.restoreFacades()
    }
  }
}
