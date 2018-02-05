"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
class RequestData {
    constructor(data) {
        this.data = data;
    }
    get(name, defaultValue) {
        if (defaultValue && !this.data[name]) {
            return defaultValue;
        }
        return this.data[name];
    }
    has(name) {
        return this.data.hasOwnProperty(name);
    }
    all() {
        return this.data;
    }
    only(...args) {
        const fields = lodash_1.flatten(args);
        return Object.keys(this.data).reduce((memo, key) => {
            if (fields.indexOf(key) !== -1) {
                memo[key] = this.data[key];
            }
            return memo;
        }, {});
    }
    except(...args) {
        const fields = lodash_1.flatten(args);
        return Object.keys(this.data).reduce((memo, key) => {
            if (fields.indexOf(key) === -1) {
                memo[key] = this.data[key];
            }
            return memo;
        }, {});
    }
}
exports.RequestData = RequestData;
