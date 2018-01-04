export declare type InstanceCreator = () => any;
export declare class ClassRegistryItem {
    className: string;
    overridable: boolean;
    singleton: boolean;
    concreteClassName?: string | undefined;
    instanceConstructor?: {
        new (): any;
    };
    instanceCreator?: InstanceCreator;
    instance?: any;
    constructor(className: string, instanceConstructor?: {
        new (): any;
    }, instanceCreator?: InstanceCreator, instance?: any, overridable?: boolean, singleton?: boolean);
    private createInstance();
    make<T>(data?: Object): T;
}
