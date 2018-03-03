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
    defer: true,
    fn: async function(defer: any) {
      await test_promise()
      defer.resolve()
    }
  })
  .add('.then for test_promise', {
    defer: true,
    fn: function(defer: any) {
      test_promise().then(function() {
        defer.resolve()
      })
    }
  })
  .add('use await for test_normal', {
    defer: true,
    fn: async function(defer: any) {
      await test_normal()
      defer.resolve()
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

suite.run({ async: true })
