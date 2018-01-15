import { ClassRegistryItem } from './../private/ClassRegistryItem'
import { mapValues } from 'lodash'
import { class_registry_circular_reference_check } from '../private/class_registry_circular_reference_check'

export class ClassRegistryCollection {
  private items: {
    [key: string]: ClassRegistryItem
  } = {}

  register(item: ClassRegistryItem) {
    this.assertRegistryItemCouldBeUpdated(item.className)
    this.assertNoCircularReference(item)
    this.items[item.className] = item
  }

  findOrFail(className: string): ClassRegistryItem {
    if (!this.has(className)) {
      throw new ReferenceError(className + ' is not found or not registered yet')
    }
    return this.items[className]
  }

  has(className: string): boolean {
    return typeof this.items[className] !== 'undefined'
  }

  assertRegistryItemCouldBeUpdated(className: string) {
    if (this.has(className)) {
      const registry: ClassRegistryItem = this.items[className]
      if (!registry.overridable) {
        throw new Error('Can not overridable ' + className)
      }
    }
  }

  assertNoCircularReference(item: ClassRegistryItem) {
    const result: { [className: string]: string | undefined } = mapValues(this.items, 'concreteClassName')
    result[item.className] = item.concreteClassName
    const circularReferences: Array<string> | false = class_registry_circular_reference_check(result)
    if (class_registry_circular_reference_check(result) !== false) {
      throw new Error('Circular reference detected "' + (circularReferences as Array<string>).join(' => ') + '"')
    }
  }
}

declare const global: Object
global['Najs'] = global['Najs'] || {}
global['Najs']['classRegistry'] = global['Najs']['classRegistry'] || {}
global['Najs']['classRegistry'] = new ClassRegistryCollection()
export const ClassRegistry: ClassRegistryCollection = global['Najs']['classRegistry']
