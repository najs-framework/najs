export interface IFacadeContainer {
  markFacadeWasUsed(key: string, type: 'mock'): void
  markFacadeWasUsed(key: string, type: 'spy'): void
  markFacadeWasUsed(key: string, type: 'stub'): void

  verifyMocks(): void

  restoreFacades(): void
}
