"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceProvider_1 = require("../core/ServiceProvider");
// import * as RedisStore from 'connect-redis'
class RedisSessionStoreServiceProvider extends ServiceProvider_1.ServiceProvider {
    getClassName() {
        return RedisSessionStoreServiceProvider.className;
    }
    async register() {
        // this.app.s
    }
}
RedisSessionStoreServiceProvider.className = 'Najs.RedisSessionStoreServiceProvider';
exports.RedisSessionStoreServiceProvider = RedisSessionStoreServiceProvider;
