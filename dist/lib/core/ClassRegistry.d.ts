import { ClassRegistryItem } from './../private/ClassRegistryItem';
export declare class ClassRegistryCollection {
    private items;
    register(item: ClassRegistryItem): void;
    findOrFail(className: string): ClassRegistryItem;
    has(className: string): boolean;
    assertRegistryItemCouldBeUpdated(className: string): void;
    assertNoCircularReference(item: ClassRegistryItem): void;
}
export declare const ClassRegistry: ClassRegistryCollection;
