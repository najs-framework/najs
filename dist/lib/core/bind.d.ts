export declare type Decorator = (target: any) => any;
export declare type InstanceCreator = () => any;
export declare function bind(className: string): Decorator;
export declare function bind(className: string, instanceCreator: InstanceCreator): void;
export declare function bind(className: string, concrete: string): void;
