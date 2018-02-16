import { IFacadeContainer } from './interfaces/IFacadeContainer'

export let FacadeContainersBag: IFacadeContainer[] = <any>[]

export function cleanFacadeContainersBag() {
  FacadeContainersBag = FacadeContainersBag.filter((container: FacadeContainer) => {
    return !container.clean()
  })
}

export function verifyAndRestoreFacades() {
  for (const container of FacadeContainersBag) {
    container.verifyMocks()
  }

  for (const container of FacadeContainersBag) {
    container.restoreFacades()
  }

  cleanFacadeContainersBag()
}

export class FacadeContainer {
  protected cleanable: boolean
  protected keyByCount: Object
  protected usedFacades: {
    spy?: string[]
    mock?: string[]
    stub?: string[]
  }

  constructor()
  constructor(cleanable: boolean)
  constructor(cleanable?: boolean) {
    this.cleanable = cleanable || false
  }

  clean(): boolean {
    if (!this.cleanable) {
      return false
    }

    const classMembers = [
      'constructor',
      'markFacadeWasUsed',
      'verifyMocks',
      'restoreFacades',
      'getKeyByCount',
      'cleanable'
    ]
    for (const name in this) {
      if (classMembers.indexOf(name) !== -1) {
        continue
      }
      delete this[name]
    }
    return true
  }

  getKeyByCount(key: string) {
    if (!this.keyByCount) {
      this.keyByCount = {}
    }
    if (!this.keyByCount[key]) {
      this.keyByCount[key] = 0
    }
    const count = ++this.keyByCount[key]
    return key.replace('{count}', count.toString())
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
