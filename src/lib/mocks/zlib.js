/**
 * Mock for Node's 'zlib' module.
 * Not needed in React Native — stubbed out to satisfy ws internals.
 */
module.exports = {
    createDeflateRaw: () => null,
    createInflateRaw: () => null,
    deflateRaw: (buf, cb) => cb(null, buf),
    inflateRaw: (buf, cb) => cb(null, buf),
    Z_DEFAULT_COMPRESSION: -1,
    Z_DEFAULT_STRATEGY: 0,
    Z_SYNC_FLUSH: 2,
};
