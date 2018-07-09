/// <reference path="../contracts/types/http.ts" />

import { INajs } from '../core/INajs'
import { FacadeContainer } from 'najs-facade'

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
}
