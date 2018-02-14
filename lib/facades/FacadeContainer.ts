import { IFacadeContainer } from './interfaces/IFacadeContainer'

export const FacadeContainersBag: IFacadeContainer[] = []

export class FacadeContainer {
  protected usedFacades: {
    spy?: string[]
    mock?: string[]
    stub?: string[]
  }

  markFacadeWasUsed(key: string, type: 'mock'): void
  markFacadeWasUsed(key: string, type: 'spy'): void
  markFacadeWasUsed(key: string, type: 'stub'): void
  markFacadeWasUsed(key: string, type: string): void {
    if (typeof this.usedFacades === 'undefined') {
      this.usedFacades = {}
    }
    if (typeof this.usedFacades[type] === 'undefined') {
      this.usedFacades[type] = []
    }
    this.usedFacades[type].push(key)
  }

  verifyMocks(): void {
    if (!this.usedFacades || !this.usedFacades.mock) {
      return
    }
    const facadeKeys: string[] = Array.from(new Set(this.usedFacades.mock))
    for (const key of facadeKeys) {
      if (!this[key] || !this[key].createdMocks) {
        continue
      }
      for (const mock of this[key].createdMocks) {
        mock.verify()
      }
    }
  }

  restoreFacades(): void {
    if (!this.usedFacades) {
      return
    }
    const facadeKeys: string[] = Array.from(
      new Set(
        ([] as string[]).concat(this.usedFacades.spy || [], this.usedFacades.stub || [], this.usedFacades.mock || [])
      )
    )
    for (const key of facadeKeys) {
      if (!this[key]) {
        continue
      }
      this[key].restoreFacade()
    }
  }
}
