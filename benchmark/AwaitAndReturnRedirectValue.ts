import * as Benchmark from 'benchmark'

async function test_promise() {
  return 'test'
}

function test_normal() {
  return 'test'
}

const suite = new Benchmark.Suite()
suite
  .add('use await for test_promise', {
    fn: async function(defer: any) {
      await test_promise()
    }
  })
  .add('use await for test_normal', {
    fn: async function(defer: any) {
      await test_normal()
    }
  })
  .add('call test_normal sync', {
    fn: async function(defer: any) {
      test_normal()
    }
  })
  .on('cycle', function(event: any) {
    console.log(String(event.target))
  })
  .on('complete', function(this: any) {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })

suite.run({ async: false })
