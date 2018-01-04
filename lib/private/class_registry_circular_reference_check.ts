export type ConcreteClassName = string | undefined

export type RegistryItems = {
  [className: string]: ConcreteClassName
}

export function class_registry_circular_reference_check(items: RegistryItems): Array<string> | false {
  for (const className in items) {
    if (typeof items[className] === 'undefined') {
      continue
    }

    const traveled: Array<string> = []
    let currentName: string = className
    while (typeof items[currentName] !== 'undefined') {
      if (traveled.indexOf(currentName) !== -1) {
        traveled.push(currentName)
        return traveled
      }

      traveled.push(currentName)
      currentName = <string>items[currentName]
    }
  }
  return false
}
