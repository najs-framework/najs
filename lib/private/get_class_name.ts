import { isString, isFunction } from 'lodash'

export function get_class_name(classDefinition: any, allowString: boolean = true): string {
  if (allowString && isString(classDefinition)) {
    return classDefinition
  }

  if (isFunction(classDefinition.prototype.getClassName)) {
    return classDefinition.prototype.getClassName.call(classDefinition)
  }

  if (isString(classDefinition.className)) {
    return classDefinition.className
  }

  throw new TypeError('Please define "className" or "getClassName" for ' + classDefinition)
}
