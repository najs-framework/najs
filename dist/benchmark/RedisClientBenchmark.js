"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Benchmark = require("benchmark");
const Redis = require("redis");
const RedisFacade_1 = require("../lib/facades/global/RedisFacade");
const redis = Redis.createClient({
    host: 'localhost',
    port: 6379
});
const suite = new Benchmark.Suite();
suite
    .add('NodeRedis.append()', {
    defer: true,
    fn: function (defer) {
        redis.append('append#1', '0', function (error, result) {
            defer.resolve();
        });
    }
})
    .add('RedisClientFacade.append() as Promise', {
    defer: true,
    fn: function (defer) {
        RedisFacade_1.RedisFacade.append('append#2', '0').then(function () {
            defer.resolve();
        });
    }
})
    .add('await RedisClientFacade.append()', {
    defer: true,
    fn: async function (defer) {
        await RedisFacade_1.RedisFacade.append('append#3', '0');
        defer.resolve();
    }
})
    .on('cycle', function (event) {
    console.log(String(event.target));
})
    .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
});
redis.del('append#1', 'append#2', 'append#3', function () {
    suite.run({ async: false });
});
