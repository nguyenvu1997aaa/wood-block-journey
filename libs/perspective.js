!(function (a) {
    if ('object' == typeof exports && 'undefined' != typeof module) module.exports = a()
    else if ('function' == typeof define && define.amd) define([], a)
    else {
        var b
        ;(b =
            'undefined' != typeof window
                ? window
                : 'undefined' != typeof global
                ? global
                : 'undefined' != typeof self
                ? self
                : this),
            (b.Perspective = a())
    }
})(function () {
    return (function a(b, c, d) {
        function e(g, h) {
            if (!c[g]) {
                if (!b[g]) {
                    var i = 'function' == typeof require && require
                    if (!h && i) return i(g, !0)
                    if (f) return f(g, !0)
                    var j = new Error("Cannot find module '" + g + "'")
                    throw ((j.code = 'MODULE_NOT_FOUND'), j)
                }
                var k = (c[g] = { exports: {} })
                b[g][0].call(
                    k.exports,
                    function (a) {
                        var c = b[g][1][a]
                        return e(c ? c : a)
                    },
                    k,
                    k.exports,
                    a,
                    b,
                    c,
                    d
                )
            }
            return c[g].exports
        }
        for (var f = 'function' == typeof require && require, g = 0; g < d.length; g++) e(d[g])
        return e
    })(
        {
            1: [
                function (a, b, c) {
                    var d = window.html5jp || {}
                    !(function () {
                        d.perspective = function (a, b) {
                            if (a && a.strokeStyle && b && b.width && b.height) {
                                var c = document.createElement('canvas')
                                ;(c.width = parseInt(b.width)), (c.height = parseInt(b.height))
                                var d = c.getContext('2d')
                                d.drawImage(b, 0, 0, c.width, c.height)
                                var e = document.createElement('canvas')
                                ;(e.width = a.canvas.width), (e.height = a.canvas.height)
                                var f = e.getContext('2d')
                                this.p = { ctxd: a, cvso: c, ctxo: d, ctxt: f }
                            }
                        }
                        var a = d.perspective.prototype
                        ;(a.draw = function (a) {
                            for (
                                var b = a[0][0],
                                    c = a[0][1],
                                    d = a[1][0],
                                    e = a[1][1],
                                    f = a[2][0],
                                    g = a[2][1],
                                    h = a[3][0],
                                    i = a[3][1],
                                    j = [
                                        Math.sqrt(Math.pow(b - d, 2) + Math.pow(c - e, 2)),
                                        Math.sqrt(Math.pow(d - f, 2) + Math.pow(e - g, 2)),
                                        Math.sqrt(Math.pow(f - h, 2) + Math.pow(g - i, 2)),
                                        Math.sqrt(Math.pow(h - b, 2) + Math.pow(i - c, 2)),
                                    ],
                                    k = this.p.cvso.width,
                                    l = this.p.cvso.height,
                                    m = 0,
                                    n = 0,
                                    o = 0,
                                    p = 0;
                                4 > p;
                                p++
                            ) {
                                var q = 0
                                ;(q = p % 2 ? j[p] / k : j[p] / l),
                                    q > n && ((m = p), (n = q)),
                                    0 == j[p] && o++
                            }
                            if (!(o > 1)) {
                                var r = 2,
                                    s = 5 * r,
                                    t = this.p.ctxo,
                                    u = this.p.ctxt
                                if (
                                    (u.clearRect(0, 0, u.canvas.width, u.canvas.height), m % 2 == 0)
                                ) {
                                    var v = this.create_canvas_context(k, s)
                                    v.globalCompositeOperation = 'copy'
                                    for (var w = v.canvas, x = 0; l > x; x += r) {
                                        var y = x / l,
                                            z = b + (h - b) * y,
                                            A = c + (i - c) * y,
                                            B = d + (f - d) * y,
                                            C = e + (g - e) * y,
                                            D = Math.atan((C - A) / (B - z)),
                                            E =
                                                Math.sqrt(Math.pow(B - z, 2) + Math.pow(C - A, 2)) /
                                                k
                                        v.setTransform(1, 0, 0, 1, 0, -x),
                                            v.drawImage(t.canvas, 0, 0),
                                            u.translate(z, A),
                                            u.rotate(D),
                                            u.scale(E, E),
                                            u.drawImage(w, 0, 0),
                                            u.setTransform(1, 0, 0, 1, 0, 0)
                                    }
                                } else if (m % 2 == 1) {
                                    var v = this.create_canvas_context(s, l)
                                    v.globalCompositeOperation = 'copy'
                                    for (var w = v.canvas, F = 0; k > F; F += r) {
                                        var y = F / k,
                                            z = b + (d - b) * y,
                                            A = c + (e - c) * y,
                                            B = h + (f - h) * y,
                                            C = i + (g - i) * y,
                                            D = Math.atan((z - B) / (C - A)),
                                            E =
                                                Math.sqrt(Math.pow(B - z, 2) + Math.pow(C - A, 2)) /
                                                l
                                        v.setTransform(1, 0, 0, 1, -F, 0),
                                            v.drawImage(t.canvas, 0, 0),
                                            u.translate(z, A),
                                            u.rotate(D),
                                            u.scale(E, E),
                                            u.drawImage(w, 0, 0),
                                            u.setTransform(1, 0, 0, 1, 0, 0)
                                    }
                                }
                                this.p.ctxd.save(),
                                    this.p.ctxd.drawImage(u.canvas, 0, 0),
                                    this._applyMask(this.p.ctxd, [
                                        [b, c],
                                        [d, e],
                                        [f, g],
                                        [h, i],
                                    ]),
                                    this.p.ctxd.restore()
                            }
                        }),
                            (a.create_canvas_context = function (a, b) {
                                var c = document.createElement('canvas')
                                ;(c.width = a), (c.height = b)
                                var d = c.getContext('2d')
                                return d
                            }),
                            (a._applyMask = function (a, b) {
                                a.beginPath(), a.moveTo(b[0][0], b[0][1])
                                for (var c = 1; c < b.length; c++) a.lineTo(b[c][0], b[c][1])
                                a.closePath(),
                                    (a.globalCompositeOperation = 'destination-in'),
                                    a.fill(),
                                    (a.globalCompositeOperation = 'source-over')
                            })
                    })(),
                        (b.exports = d.perspective)
                },
                {},
            ],
        },
        {},
        [1]
    )(1)
})
