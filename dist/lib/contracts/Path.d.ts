declare namespace Najs.Contracts {
    interface Path extends Autoload {
        /**
         * Resolve a sequence of paths or path segments into project root. This is an alias of .cwd()
         *
         * @param {string|string[]} paths A sequence of paths or path segments
         */
        get(...paths: string[]): string;
        /**
         * Resolve a sequence of paths or path segments into project root.
         *
         * @param {string|string[]} paths A sequence of paths or path segments
         */
        cwd(...paths: string[]): string;
        /**
         * Resolve a sequence of paths or path segments into "app" directory (default: ~/app/)
         *
         * @param {string|string[]} paths A sequence of paths or path segments
         */
        app(...paths: string[]): string;
        /**
         * Resolve a sequence of paths or path segments into "config" directory (default: ~/config/)
         *
         * @param {string|string[]} paths A sequence of paths or path segments
         */
        config(...paths: string[]): string;
        /**
         * Resolve a sequence of paths or path segments into "layout" directory (default: ~/resources/view/layout/)
         *
         * @param {string|string[]} paths A sequence of paths or path segments
         */
        layout(...paths: string[]): string;
        /**
         * Resolve a sequence of paths or path segments into "public" directory (default: ~/public/)
         *
         * @param {string|string[]} paths A sequence of paths or path segments
         */
        public(...paths: string[]): string;
        /**
         * Resolve a sequence of paths or path segments into "resource" directory (default: ~/resources/)
         *
         * @param {string|string[]} paths A sequence of paths or path segments
         */
        resource(...paths: string[]): string;
        /**
         * Resolve a sequence of paths or path segments into "route" directory (default: ~/routes/)
         *
         * @param {string|string[]} paths A sequence of paths or path segments
         */
        route(...paths: string[]): string;
        /**
         * Resolve a sequence of paths or path segments into "storage" directory (default: ~/app/storage/)
         *
         * @param {string|string[]} paths A sequence of paths or path segments
         */
        storage(...paths: string[]): string;
        /**
         * Resolve a sequence of paths or path segments into "view" directory (default: ~/resources/view/)
         *
         * @param {string|string[]} paths A sequence of paths or path segments
         */
        view(...paths: string[]): string;
    }
}
