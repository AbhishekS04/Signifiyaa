const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

/**
 * Mock Node standard library modules that ws / supabase-realtime try to import.
 * The ws package itself is fully mocked via src/lib/mocks/ws.js so Metro
 * should never need to walk into ws/lib/* — but blockList enforces that.
 */
config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    // ws is fully replaced by our self-contained mock
    ws: path.resolve(__dirname, "src/lib/mocks/ws.js"),
    // Node stdlib stubs
    stream: path.resolve(__dirname, "src/lib/mocks/stream.js"),
    crypto: path.resolve(__dirname, "src/lib/mocks/crypto.js"),
    events: path.resolve(__dirname, "src/lib/mocks/events.js"),
    buffer: path.resolve(__dirname, "src/lib/mocks/buffer.js"),
    http: path.resolve(__dirname, "src/lib/mocks/http.js"),
    https: path.resolve(__dirname, "src/lib/mocks/http.js"),
    net: path.resolve(__dirname, "src/lib/mocks/net.js"),
    tls: path.resolve(__dirname, "src/lib/mocks/net.js"),
    zlib: path.resolve(__dirname, "src/lib/mocks/zlib.js"),
    url: path.resolve(__dirname, "src/lib/mocks/url.js"),
};

/**
 * Block Metro from traversing into the real ws/lib/* files entirely.
 * This stops the cascade of Node stdlib imports at the source.
 */
const wsLibPath = path.resolve(__dirname, "node_modules/ws/lib");
const escapedWsLibPath = wsLibPath.replace(/[\\]/g, "\\\\");
const blockListRegex = new RegExp(`^${escapedWsLibPath}.*`);

config.resolver.blockList = blockListRegex;

module.exports = withNativeWind(config, { input: "./global.css" });
