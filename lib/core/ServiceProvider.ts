import { IApplication } from './IApplication'
import { IAutoload } from './IAutoload'

export abstract class ServiceProvider implements IAutoload {
  abstract getClassName(): string

  protected setFacadeRoot: (name: string, instance: any) => void
  protected app: IApplication

  private constructor(app: IApplication, setFacadeRoot: (name: string, instance: any) => void) {
    this.app = app
    this.setFacadeRoot = setFacadeRoot
  }

  async register() {}

  async boot() {}
}
