import { IApplication } from './IApplication'
import { IAutoload } from './IAutoload'

export abstract class ServiceProvider implements IAutoload {
  abstract getClassName(): string

  protected app: IApplication

  constructor(application: IApplication) {
    this.app = application
  }

  public register(): void {}

  public boot(): void {}
}
