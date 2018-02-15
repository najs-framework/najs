"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
class RequestData {
    constructor(data) {
        this.data = data;
    }
    get(path, defaultValue) {
        return lodash_1.get(this.data, path, defaultValue);
    }
    has(path) {
        return lodash_1.has(this.data, path);
    }
    all() {
        return this.data;
    }
    only(...args) {
        const paths = lodash_1.flatten(args);
        return paths.reduce((memo, path) => {
            lodash_1.set(memo, path, lodash_1.get(this.data, path));
            return memo;
        }, {});
    }
    except(...args) {
        const paths = lodash_1.flatten(args);
        return paths.reduce((memo, path) => {
            lodash_1.unset(memo, path);
            return memo;
        }, Object.assign({}, this.data));
    }
}
exports.RequestData = RequestData;
