export declare function route(name: string): string;
export declare function route(name: string, param: Object): string;
export declare function route(name: string, param: Object, options: {
    encode: (value: string) => string;
}): string;
