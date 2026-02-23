/**
 * Mock for Node's 'http' and 'https' modules.
 * Not needed in React Native — stubbed out to satisfy ws internals.
 */
module.exports = {
    createServer: () => ({
        on: () => { },
        listen: () => { },
        close: () => { },
    }),
    request: () => { },
    get: () => { },
    Server: class { },
    IncomingMessage: class { },
    ServerResponse: class { },
};
