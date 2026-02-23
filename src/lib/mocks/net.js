/**
 * Mock for Node's 'net' and 'tls' modules.
 * Not needed in React Native — stubbed out to satisfy ws internals.
 */
module.exports = {
    createServer: () => ({
        on: () => { },
        listen: () => { },
        close: () => { },
    }),
    createConnection: () => { },
    connect: () => { },
    Socket: class {
        on() { return this; }
        write() { }
        end() { }
        destroy() { }
    },
    Server: class { },
};
