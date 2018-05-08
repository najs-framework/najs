namespace Najs.Log {
  export type LoggerLevels = {
    emergency: string
    alert: string
    critical: string
    error: string
    warning: string
    notice: string
    info: string
    debug: string
  }
}

namespace Najs.Contracts {
  export interface Log extends Autoload {
    /**
     * Write log with emergency level - syslog level 0 (highest)
     *
     * @param {string} message
     * @param {mixed} meta
     */
    emergency(message: string, ...meta: any[]): this

    /**
     * Write log with alert level - syslog level 1
     *
     * @param {string} message
     * @param {mixed} meta
     */
    alert(message: string, ...meta: any[]): this

    /**
     * Write log with critical level - syslog level 2
     *
     * @param {string} message
     * @param {mixed} meta
     */
    critical(message: string, ...meta: any[]): this

    /**
     * Write log with error level - syslog level 3
     *
     * @param {string} message
     * @param {mixed} meta
     */
    error(message: string, ...meta: any[]): this

    /**
     * Write log with warning level - syslog level 4
     *
     * @param {string} message
     * @param {mixed} meta
     */
    warning(message: string, ...meta: any[]): this

    /**
     * Write log with notice level - syslog level 5
     *
     * @param {string} message
     * @param {mixed} meta
     */
    notice(message: string, ...meta: any[]): this

    /**
     * Write log with info level - syslog level 7
     *
     * @param {string} message
     * @param {mixed} meta
     */
    info(message: string, ...meta: any[]): this

    /**
     * Write log with debug level - syslog level 7
     *
     * @param {string} message
     * @param {mixed} meta
     */
    debug(message: string, ...meta: any[]): this
  }
}
