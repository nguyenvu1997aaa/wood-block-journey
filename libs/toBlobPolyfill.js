if (!HTMLCanvasElement.prototype.toBlob) {
    Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
        value: function (callback, type, quality) {
            var bin = atob(this.toDataURL(type, quality).split(',')[1]),
                len = bin.length,
                len32 = len >> 2,
                a8 = new Uint8Array(len),
                a32 = new Uint32Array(a8.buffer, 0, len32)

            for (var i = 0, j = 0; i < len32; i++) {
                a32[i] =
                    bin.charCodeAt(j++) |
                    (bin.charCodeAt(j++) << 8) |
                    (bin.charCodeAt(j++) << 16) |
                    (bin.charCodeAt(j++) << 24)
            }

            var tailLength = len & 3

            while (tailLength--) {
                a8[j] = bin.charCodeAt(j++)
            }

            callback(new Blob([a8], { type: type || 'image/png' }))
        },
    })
}
