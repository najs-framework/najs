import * as Benchmark from 'benchmark'

class Test {
  value: string

  constructor(value: string) {
    this.value = value
  }
}

const suite = new Benchmark.Suite()
suite
  .add('new Class(...)', {
    fn: function() {
      new Test('test')
    }
  })
  .add('Reflect.construct(...)', {
    fn: function() {
      Reflect.construct(Test, ['test'])
    }
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })

suite.run({ async: true })
