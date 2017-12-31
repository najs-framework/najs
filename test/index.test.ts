import 'jest'
import Najs from '../lib'

class Test {
  static className: string = 'Test'
}

describe('Najs', function() {
  it('proxies register() function', function() {
    Najs.register(Test)
  })

  it('proxies make() function', function() {
    expect(Najs.make(Test)).toBeInstanceOf(Test)
  })
})
