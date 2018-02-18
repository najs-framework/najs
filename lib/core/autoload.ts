import { make } from './make'

export function autoload(classDefinition: any): any
export function autoload(className: string): any {
  return function(target: any, key: string, descriptor: PropertyDescriptor) {
    if (typeof target === 'function') {
      throw new TypeError('Could not apply autoload decorator to Class')
    }
    if (typeof descriptor !== 'undefined') {
      throw new TypeError('Could not apply autoload decorator to Method')
    }

    Object.defineProperty(target, key, {
      get: function(this: any) {
        if (typeof this.__autoload === 'undefined') {
          this.__autoload = {}
        }

        if (typeof this.__autoload[className] === 'undefined') {
          this.__autoload[className] = make(className)
        }

        if (this.__autoloadMetadata) {
          if (this.__autoload[className].__autoloadMetadata) {
            Object.assign(this.__autoload[className].__autoloadMetadata, this.__autoloadMetadata)
          } else {
            this.__autoload[className].__autoloadMetadata = this.__autoloadMetadata
          }
        }
        return this.__autoload[className]
      },
      set: function(value: any) {
        throw new Error('Can not set autoload property "' + key + '"')
      }
    })
  }
}
