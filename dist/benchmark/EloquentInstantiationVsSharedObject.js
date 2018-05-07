"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Benchmark = require("benchmark");
class ComponentAlphaInstantiation {
    constructor(target) {
        this.target = target;
    }
    isGetter(key) {
        return key === 'a';
    }
    performGetter(key) {
        return this.getAlpha.bind(this);
    }
    getAlpha() {
        // console.log(this)
        return this.target.test + '-a';
    }
}
class ComponentBetaInstantiation {
    constructor(target) {
        this.target = target;
    }
    isGetter(key) {
        return key === 'b';
    }
    performGetter(key) {
        return this.getBeta.bind(this);
    }
    getBeta() {
        // console.log(this.target['a']())
        return this.target.test + '-b';
    }
}
class ProxyInstantiation {
    constructor(target) {
        this.target = target;
        this.components = [new ComponentAlphaInstantiation(target), new ComponentBetaInstantiation(target)];
        return;
    }
    get(target, key) {
        for (const component of this.components) {
            if (component.isGetter(key)) {
                return component.performGetter(target, key);
            }
        }
        return target[key];
    }
    set(target, key, value) {
        return true;
    }
}
class ModelInstantiation {
    constructor() {
        this.test = 'test';
        return new Proxy(this, new ProxyInstantiation(this));
    }
}
// ---------------------------------------------------------------------------------------------------------------------
class ComponentAlphaShared {
    isGetter(key) {
        return key === 'a';
    }
    performGetter(target, key) {
        return this.getAlpha.bind(target);
    }
    getAlpha() {
        return this.test + '-a';
    }
}
class ComponentBetaShared {
    isGetter(key) {
        return key === 'b';
    }
    performGetter(target, key) {
        return this.getBeta.bind(target);
    }
    getBeta() {
        // console.log(this)
        // console.log(this['a'])
        return this['test'] + '-b';
    }
}
class ModelShared {
    constructor() {
        this.test = 'test';
        const components = [new ComponentAlphaShared(), new ComponentBetaShared()];
        return new Proxy(this, {
            get: function (target, key) {
                for (const component of components) {
                    if (component.isGetter(key)) {
                        return component.performGetter(target, key);
                    }
                }
                return target[key];
            },
            set: function (target, key, value) {
                return true;
            }
        });
    }
}
// ---------------------------------------------------------------------------------------------------------------------
class ComponentAlphaExtending {
    extends(prototype) {
        prototype.a = ComponentAlphaExtending.getAlpha;
    }
    static getAlpha() {
        return this.test + '-a';
    }
}
class ComponentBetaExtending {
    extends(prototype) {
        prototype.b = ComponentBetaExtending.getBeta;
    }
    static getBeta() {
        return this.test + '-b';
    }
}
const ModelExtending = function () {
    this.test = 'test';
};
const componentAlphaExtending = new ComponentAlphaExtending();
const componentBetaExtending = new ComponentBetaExtending();
componentAlphaExtending.extends(ModelExtending.prototype);
componentBetaExtending.extends(ModelExtending.prototype);
// ---------------------------------------------------------------------------------------------------------------------
class ModelRaw {
    constructor() {
        this.test = 'test';
    }
    a() {
        return this.test + '-a';
    }
    b() {
        return this.test + '-b';
    }
}
// ---------------------------------------------------------------------------------------------------------------------
const suite = new Benchmark.Suite();
suite
    .add('Eloquent with instantiation', {
    fn: function (defer) {
        const modelShared = new ModelShared();
        modelShared['a']();
        modelShared['b']();
    }
})
    .add('Eloquent with shared object', {
    fn: function (defer) {
        const modelInstantiation = new ModelInstantiation();
        modelInstantiation['a']();
        modelInstantiation['b']();
    }
})
    .add('Eloquent extending object', {
    fn: function (defer) {
        const modelExtending = new ModelExtending();
        modelExtending['a']();
        modelExtending['b']();
    }
})
    .add('Eloquent raw object', {
    fn: function (defer) {
        const modelRaw = new ModelRaw();
        modelRaw['a']();
        modelRaw['b']();
    }
})
    .on('cycle', function (event) {
    console.log(String(event.target));
})
    .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
});
suite.run({ async: true });
