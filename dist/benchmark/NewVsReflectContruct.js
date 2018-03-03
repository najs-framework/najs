"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Benchmark = require("benchmark");
class Test {
    constructor(value) {
        this.value = value;
    }
}
const suite = new Benchmark.Suite();
suite
    .add('new Class(...)', {
    fn: function () {
        new Test('test');
    }
})
    .add('Reflect.construct(...)', {
    fn: function () {
        Reflect.construct(Test, ['test']);
    }
})
    .on('cycle', function (event) {
    console.log(String(event.target));
})
    .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
});
suite.run({ async: true });
