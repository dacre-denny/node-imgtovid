const process = require('process');

/**
 * Utility method to get an process arguments value
 * @param {*} key 
 */
function getArg(key) {

    const args = process.argv;
    const idx = args.findIndex(argument => (argument || '').toLowerCase() === key);

    return args[idx];
}

/**
 * Utility method to check if a process argument key exists
 * @param {*} key 
 */
function hasKey(key) {

    return !!(getArg[idx]);
}

/**
 * Utility method to get an process arguments path value. The convention used is that the path value is in the arg directly following
 * the keyed argument, if found. Allows default value to be supplied if not matching key found
 * @param {*} key 
 * @param {*} defaultValue 
 */
function getPath(key, defaultValue) {

    const args = process.argv;
    const idx = args.findIndex(argument => (argument || '').toLowerCase() === key);

    if (idx < 0) {
        return defaultValue;
    } else {
        return args[idx + 1];
    }
}

module.exports = {
    hasKey,
    getArg,
    getPath
}