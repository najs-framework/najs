import { IApplication } from './IApplication'
import { IAutoload } from './IAutoload'

export abstract class ServiceProvider implements IAutoload {
  abstract getClassName(): string

  protected app: IApplication

  constructor(app: IApplication) {
    this.app = app
  }

  async register() {}

  async boot() {}
}
