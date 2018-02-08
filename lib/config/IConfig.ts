export interface IConfig {
  get<T>(setting: string): T
  get<T>(setting: string, defaultValue: T): T

  has(setting: string): boolean
}
