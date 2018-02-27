import '../view/handlebars/HandlebarsViewResponse';
import { ServiceProvider } from '../core/ServiceProvider';
export declare class HandlebarsViewServiceProvider extends ServiceProvider {
    static className: string;
    getClassName(): string;
    register(): Promise<void>;
    /**
     * Load handlebars helpers by package name, please checkout full helpers and package name in
     * https://github.com/helpers/handlebars-helpers
     *
     * @param {string} packageName the package name
     */
    static withHandlebarsHelpers(packageName: string): typeof HandlebarsViewServiceProvider;
    /**
     * Load handlebars helpers by package name, please checkout full helpers and package name in
     * https://github.com/helpers/handlebars-helpers
     *
     * @param {string[]} packages the package name
     */
    static withHandlebarsHelpers(packages: string[]): typeof HandlebarsViewServiceProvider;
    /**
     * Load handlebars helpers by package name, please checkout full helpers and package name in
     * https://github.com/helpers/handlebars-helpers
     *
     * @param {string[]|string} packageName the package name
     */
    static withHandlebarsHelpers(...packageName: Array<string | string[]>): typeof HandlebarsViewServiceProvider;
}
