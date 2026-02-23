/**
 * Mock for Node's 'url' module.
 * React Native has partial URL support via WHATWG URL API.
 */
module.exports = {
    URL: global.URL,
    URLSearchParams: global.URLSearchParams,
    parse: (urlStr) => {
        try {
            const u = new URL(urlStr);
            return {
                href: u.href,
                protocol: u.protocol,
                host: u.host,
                hostname: u.hostname,
                port: u.port,
                pathname: u.pathname,
                search: u.search,
                hash: u.hash,
            };
        } catch {
            return {};
        }
    },
    format: (obj) => {
        if (typeof obj === 'string') return obj;
        return (obj.href || '');
    },
    resolve: (from, to) => new URL(to, from).href,
};
