/**
 * Complete mock for the `ws` package for React Native.
 * Uses the native global WebSocket instead of Node's ws library.
 * This prevents Metro from bundling ws/lib/* which depend on Node stdlib.
 */

const NativeWebSocket = global.WebSocket;

// Make it look like the ws WebSocket class
class WebSocket extends NativeWebSocket {
    static CONNECTING = 0;
    static OPEN = 1;
    static CLOSING = 2;
    static CLOSED = 3;
}

// Stub for WebSocketServer — not needed in React Native client apps
class WebSocketServer {
    constructor() {
        if (__DEV__) {
            console.warn('[ws mock] WebSocketServer is not supported in React Native.');
        }
    }
    on() { return this; }
    once() { return this; }
    off() { return this; }
    emit() { return this; }
    close(cb) { if (cb) cb(); }
}

// createWebSocketStream stub
function createWebSocketStream() {
    if (__DEV__) {
        console.warn('[ws mock] createWebSocketStream is not supported in React Native.');
    }
    return null;
}

WebSocket.WebSocket = WebSocket;
WebSocket.WebSocketServer = WebSocketServer;
WebSocket.createWebSocketStream = createWebSocketStream;
WebSocket.Server = WebSocketServer;

module.exports = WebSocket;
