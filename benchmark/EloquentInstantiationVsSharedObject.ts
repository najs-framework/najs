import * as Benchmark from 'benchmark'

class ComponentAlphaInstantiation {
  target: any

  constructor(target: any) {
    this.target = target
  }

  isGetter(key: any) {
    return key === 'a'
  }

  performGetter(key: any) {
    return this.getAlpha.bind(this)
  }

  getAlpha(this: any) {
    // console.log(this)
    return this.target.test + '-a'
  }
}

class ComponentBetaInstantiation {
  target: any

  constructor(target: any) {
    this.target = target
  }

  isGetter(key: any) {
    return key === 'b'
  }

  performGetter(key: any) {
    return this.getBeta.bind(this)
  }

  getBeta(this: any) {
    // console.log(this.target['a']())
    return this.target.test + '-b'
  }
}

class ProxyInstantiation {
  target: any
  components: any[]

  constructor(target: any) {
    this.target = target
    this.components = [new ComponentAlphaInstantiation(target), new ComponentBetaInstantiation(target)]
    return
  }

  get(target: any, key: any) {
    for (const component of this.components) {
      if (component.isGetter(key)) {
        return component.performGetter(target, key)
      }
    }
    return target[key]
  }

  set(target: any, key: any, value: any): boolean {
    return true
  }
}

class ModelInstantiation {
  test: string
  constructor() {
    this.test = 'test'
    return new Proxy(this, new ProxyInstantiation(this))
  }
}

// ---------------------------------------------------------------------------------------------------------------------

class ComponentAlphaShared {
  isGetter(key: any) {
    return key === 'a'
  }

  performGetter(target: any, key: any) {
    return this.getAlpha.bind(target)
  }

  getAlpha(this: any) {
    return this.test + '-a'
  }
}

class ComponentBetaShared {
  isGetter(key: any) {
    return key === 'b'
  }

  performGetter(target: any, key: any) {
    return this.getBeta.bind(target)
  }

  getBeta(this: any) {
    // console.log(this)
    // console.log(this['a'])
    return this['test'] + '-b'
  }
}

class ModelShared {
  test: string
  constructor() {
    this.test = 'test'
    const components = [new ComponentAlphaShared(), new ComponentBetaShared()]
    return new Proxy(this, {
      get: function(target: any, key: any) {
        for (const component of components) {
          if (component.isGetter(key)) {
            return component.performGetter(target, key)
          }
        }
        return target[key]
      },

      set: function(target: any, key: any, value: any): boolean {
        return true
      }
    })
  }
}

// ---------------------------------------------------------------------------------------------------------------------

class ComponentAlphaExtending {
  extends(prototype: any) {
    prototype.a = ComponentAlphaExtending.getAlpha
  }

  static getAlpha(this: any) {
    return this.test + '-a'
  }
}

class ComponentBetaExtending {
  extends(prototype: any) {
    prototype.b = ComponentBetaExtending.getBeta
  }

  static getBeta(this: any) {
    return this.test + '-b'
  }
}

const ModelExtending: any = function(this: any): any {
  this.test = 'test'
}

const componentAlphaExtending = new ComponentAlphaExtending()
const componentBetaExtending = new ComponentBetaExtending()
componentAlphaExtending.extends(ModelExtending.prototype)
componentBetaExtending.extends(ModelExtending.prototype)

// ---------------------------------------------------------------------------------------------------------------------

class ModelRaw {
  test: any
  constructor() {
    this.test = 'test'
  }

  a(): string {
    return this.test + '-a'
  }

  b(): string {
    return this.test + '-b'
  }
}

// ---------------------------------------------------------------------------------------------------------------------

const suite = new Benchmark.Suite()
suite
  .add('Eloquent with instantiation', {
    fn: function(defer: any) {
      const modelShared = new ModelShared()
      modelShared['a']()
      modelShared['b']()
    }
  })
  .add('Eloquent with shared object', {
    fn: function(defer: any) {
      const modelInstantiation = new ModelInstantiation()
      modelInstantiation['a']()
      modelInstantiation['b']()
    }
  })
  .add('Eloquent extending object', {
    fn: function(defer: any) {
      const modelExtending = new ModelExtending()
      modelExtending['a']()
      modelExtending['b']()
    }
  })
  .add('Eloquent raw object', {
    fn: function(defer: any) {
      const modelRaw = new ModelRaw()
      modelRaw['a']()
      modelRaw['b']()
    }
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })

suite.run({ async: true })
