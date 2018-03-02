"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Benchmark = require("benchmark");
async function test_promise() {
    return 'test';
}
function test_normal() {
    return 'test';
}
const suite = new Benchmark.Suite();
suite
    .add('use await for test_promise', {
    fn: async function (defer) {
        await test_promise();
    }
})
    .add('use await for test_normal', {
    fn: async function (defer) {
        await test_normal();
    }
})
    .add('call test_normal sync', {
    fn: async function (defer) {
        test_normal();
    }
})
    .on('cycle', function (event) {
    console.log(String(event.target));
})
    .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
});
suite.run({ async: false });
