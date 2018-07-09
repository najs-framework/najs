// import { INajs } from '../core/INajs'
import { FacadeContainer } from 'najs-facade'

export class TestSuite {
  // static najs: INajs
  // static isStarted: boolean = false
  protected nativeHttpDriver: any

  // static start(najs: INajs) {
  //   this.najs = najs
  // }

  // async setUpExpressIfNeeded() {
  //   // if (!TestSuite.isSetUpExpress) {
  //   //   await Najs.start({
  //   //     createServer: false
  //   //   })
  //   //   TestSuite.isSetUpExpress = true
  //   //   this.express = Najs['httpDriver']['express']
  //   // }
  // }

  setUp() {}

  tearDown() {
    FacadeContainer.verifyAndRestoreAllFacades()
  }
}
