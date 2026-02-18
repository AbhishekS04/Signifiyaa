const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require('path');

const config = getDefaultConfig(__dirname);

const emptyModule = path.resolve(__dirname, 'src/lib/empty.js');

// Node.js built-ins that don't exist in React Native
// extraNodeModules only works for YOUR code, not inside node_modules.
// resolveRequest intercepts ALL resolutions including deep inside node_modules.
const NODE_BUILTINS = new Set([
    'ws',
    'stream',
    'http',
    'https',
    'http2',
    'crypto',
    'os',
    'path',
    'zlib',
    'net',
    'tls',
    'fs',
    'fs/promises',
    'events',
    'url',
    'util',
    'assert',
    'buffer',
    'querystring',
    'child_process',
    'cluster',
    'dns',
    'domain',
    'readline',
    'repl',
    'string_decoder',
    'timers',
    'tty',
    'v8',
    'vm',
    'worker_threads',
]);

config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (NODE_BUILTINS.has(moduleName)) {
        return { filePath: emptyModule, type: 'sourceFile' };
    }
    // Fall back to default resolution
    return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
