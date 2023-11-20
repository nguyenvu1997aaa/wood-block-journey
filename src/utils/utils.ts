export const airResistanceForce = (v: number, k1 = 0.1, k2 = 0.04): number => {
    return k1 * v + Math.sign(v) * k2 * v * v
}
