/// <reference path="../contracts/Application.ts" />

import { IAutoload } from 'najs-binding'

export abstract class ServiceProvider implements IAutoload {
  abstract getClassName(): string

  protected app: Najs.Contracts.Application

  constructor(app: Najs.Contracts.Application) {
    this.app = app
  }

  async register() {}

  async boot() {}
}
