float shiftRight (float v, float amt) {
    v = floor(v) + 0.5;
    return floor(v / exp2(amt));
}
float shiftLeft (float v, float amt) {
    return floor(v * exp2(amt) + 0.5);
}
float maskLast (float v, float bits) {
    return mod(v, shiftLeft(1.0, bits));
}
float extractBits (float num, float from, float to) {
    from = floor(from + 0.5); to = floor(to + 0.5);
    return maskLast(shiftRight(num, from), to - from);
}
vec4 floatToRgba (float val, bool littleEndian) {
    if (val == 0.0) return vec4(0, 0, 0, 0);
    float sign = val > 0.0 ? 0.0 : 1.0;
    val = abs(val);
    float exponent = floor(log2(val));
    float biasedExponent = exponent + 127.0;
    float fraction = ((val / exp2(exponent)) - 1.0) * 8388608.0;
    float t = biasedExponent / 2.0;
    float lastBitOfBiasedExponent = fract(t) * 2.0;
    float remainingBitsOfBiasedExponent = floor(t);
    float byte4 = extractBits(fraction, 0.0, 8.0) / 255.0;
    float byte3 = extractBits(fraction, 8.0, 16.0) / 255.0;
    float byte2 = (lastBitOfBiasedExponent * 128.0 + extractBits(fraction, 16.0, 23.0)) / 255.0;
    float byte1 = (sign * 128.0 + remainingBitsOfBiasedExponent) / 255.0;
    return (
        littleEndian
        ? vec4(byte4, byte3, byte2, byte1)
        : vec4(byte1, byte2, byte3, byte4)
    );
}

#pragma glslify: export(floatToRgba)
