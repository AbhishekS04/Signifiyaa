module.exports = {
    randomFillSync: (buffer) => {
        for (let i = 0; i < buffer.length; i++) {
            buffer[i] = Math.floor(Math.random() * 256);
        }
        return buffer;
    },
    randomBytes: (size) => {
        const bytes = new Uint8Array(size);
        for (let i = 0; i < size; i++) {
            bytes[i] = Math.floor(Math.random() * 256);
        }
        return bytes;
    },
    createHash: () => ({
        update: () => ({
            digest: () => ""
        })
    })
};
