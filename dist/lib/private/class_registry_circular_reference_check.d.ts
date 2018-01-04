export declare type ConcreteClassName = string | undefined;
export declare type RegistryItems = {
    [className: string]: ConcreteClassName;
};
export declare function class_registry_circular_reference_check(items: RegistryItems): Array<string> | false;
