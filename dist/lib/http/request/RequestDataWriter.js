"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RequestDataReader_1 = require("./RequestDataReader");
const lodash_1 = require("lodash");
class RequestDataWriter extends RequestDataReader_1.RequestDataReader {
    set(path, value) {
        lodash_1.set(this.data, path, value);
        return this;
    }
    put(path, value) {
        return this.set(path, value);
    }
    push(path, value) {
        return this.set(path, value);
    }
    pull(path, defaultValue) {
        const value = this.get(path, defaultValue);
        this.delete(path);
        return value;
    }
    delete(path) {
        lodash_1.unset(this.data, path);
        return this;
    }
    remove(path) {
        return this.delete(path);
    }
    forget(path) {
        return this.delete(path);
    }
    clear() {
        this.data = {};
        return this;
    }
    flush() {
        return this.clear();
    }
}
exports.RequestDataWriter = RequestDataWriter;
