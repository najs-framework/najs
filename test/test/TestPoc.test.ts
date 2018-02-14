import { jest } from '../../lib/test/jest'
import { TestSuite } from '../../lib/test/TestSuite'
import { ResponseFacade } from '../../lib/facades/global/ResponseFacade'

@jest()
export class TestPoc extends TestSuite {
  testSomething() {
    ResponseFacade.shouldReceive('json').once()
    ResponseFacade.json('test')
  }
}
