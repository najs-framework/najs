import 'jest'
import { make, register, IAutoload } from '../../lib'

class Test implements IAutoload {
  any?: string

  getClassName() {
    return 'Test'
  }

  getSomething() {
    return 'something'
  }

  getFromParent() {
    return 'gift'
  }
}

class TestCached extends Test implements IAutoload {
  getClassName() {
    return 'TestCached'
  }

  getSomething() {
    return 'something cached'
  }

  getFromParent() {
    return 'thanks for your ' + super.getFromParent()
  }
}

class TestInstanceWithData implements IAutoload {
  any: string
  constructor(any?: string) {
    this.any = any || ''
  }

  getClassName() {
    return 'TestInstanceWithData'
  }

  createClassInstance(data?: Object): TestInstanceWithData {
    const instance = new TestInstanceWithData()
    if (data) {
      for (const name in data) {
        instance[name] = data[name]
      }
    }
    return instance
  }
}

describe('Najs.make', function() {
  register(Test)

  it('throws an ReferenceError if the class definition was not register', function() {
    try {
      expect(make('NotFound'))
    } catch (error) {
      expect(error instanceof ReferenceError)
      expect(error.message).toEqual('NotFound is not found or not registered yet')
      return
    }
    expect('should throw a ReferenceError').toEqual('')
  })

  describe('<T>(classDefinition: T)', function() {
    it('can make an instance of class definition which was register by Najs.register()', function() {
      expect(make(Test)).toBeInstanceOf(Test)
    })

    it('always returns new instance if class definitions was register by Najs.register()', function() {
      expect(make(Test) === make(Test)).toBe(false)
      expect(make<Test>(Test).getSomething()).toEqual('something')
      expect(make<Test>(Test).getFromParent()).toEqual('gift')
    })

    it('always returns newest instance of class definitions was overridden', function() {
      register(TestCached, 'Test')
      expect(make(Test)).toBeInstanceOf(Test)
      expect(make(Test)).toBeInstanceOf(TestCached)
      expect(make<Test>(Test).getClassName()).toEqual('TestCached')
      expect(make<Test>(Test).getSomething()).toEqual('something cached')
      expect(make<TestCached>(Test).getFromParent()).toEqual('thanks for your gift')
    })
  })

  describe('<T>(className: string)', function() {
    it('works same way like passing a class definition', function() {
      expect(make('Test') === make('Test')).toBe(false)
      expect(make('Test')).toBeInstanceOf(Test)
      expect(make('Test')).toBeInstanceOf(TestCached)
      expect(make<Test>('Test').getClassName()).toEqual('TestCached')
      expect(make<Test>('Test').getSomething()).toEqual('something cached')
      expect(make<TestCached>('Test').getFromParent()).toEqual('thanks for your gift')
    })
  })

  describe('<T>(nameOrDefinition: T | string, data: Object)', function() {
    it('does not create instance with data if createClassInstance() is not implemented', function() {
      expect(make<Test>(Test, { any: 'something' }).any).toBeUndefined()
    })

    it('calls createClassInstance() and pass data to create new instance', function() {
      register(TestInstanceWithData)
      expect(make<TestInstanceWithData>(TestInstanceWithData, { any: 'something' }).any).toEqual('something')
    })
  })
})
