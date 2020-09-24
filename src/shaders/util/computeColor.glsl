#pragma glslify: isCloseEnough = require(./isCloseEnough.glsl)
#pragma glslify: getTexelValue = require(./getTexelValue.glsl)

#ifndef DEFAULT_COLOR
#define DEFAULT_COLOR vec4(0.0)
#endif

#ifndef SCALE_MAX_LENGTH
#define SCALE_MAX_LENGTH 16
#endif

#ifndef SENTINEL_MAX_LENGTH
#define SENTINEL_MAX_LENGTH 16
#endif

vec4 computeColor(
  float inputVal,
  sampler2D scaleColormap,
  sampler2D sentinelColormap,
  int scaleLength,
  int sentinelLength,
  bool littleEndian
) {

  // vertical texture coordinate to find color and offset
  float colorRow = 0.25;
  float offsetRow = 0.75;

  // Compare the value against any sentinel values, if defined.
  if (sentinelLength > 0) {
    for (int i = 0; i < SENTINEL_MAX_LENGTH; ++i) {
      if (i == sentinelLength) {
        break;
      }

      float i_f = float(i);
      float sentinelLengthFloat = float(sentinelLength);
      // retrieve the offset from the colormap
      float sentinelOffset = getTexelValue(sentinelColormap, vec2((i_f + 0.5) / sentinelLengthFloat, offsetRow), littleEndian);
      if (isCloseEnough(inputVal, sentinelOffset)) {
        // retrieve the color from the colormap
        vec2 colormapCoord = vec2((i_f + 0.5) / sentinelLengthFloat, colorRow);
        return texture2D(sentinelColormap, colormapCoord);
      }
    }
  }

  // Do linear interpolation using the color scale, if defined.
  if (scaleLength > 0) {
    // If value below color scale range, clamp to lowest color stop.
    float scaleOffsetLowest = getTexelValue(scaleColormap, vec2(0.0, offsetRow), littleEndian);
    float scaleOffsetHighest = getTexelValue(scaleColormap, vec2(1.0, offsetRow), littleEndian);
    if (inputVal < scaleOffsetLowest) {
      return texture2D(scaleColormap, vec2(0.0, colorRow));
    } else if (inputVal > scaleOffsetHighest) {
      return texture2D(scaleColormap, vec2(1.0, colorRow));
    } else {
      for (int i = 0; i < SCALE_MAX_LENGTH; ++i) {
        float i_f = float(i);
        float scaleLengthFloat = float(scaleLength);

        // If value above color scale range, clamp to highest color stop.
        if (i == scaleLength) {
          return texture2D(sentinelColormap, vec2((scaleLengthFloat - 0.5) / scaleLengthFloat, colorRow));
        }

        float scaleOffsetNext = getTexelValue(scaleColormap, vec2((i_f + 1.0 + 0.5) / scaleLengthFloat, offsetRow), littleEndian);

        if (inputVal <= scaleOffsetNext) {
          float scaleOffset = getTexelValue(scaleColormap, vec2((i_f + 0.5) / scaleLengthFloat, offsetRow), littleEndian);
          float percent = (inputVal - scaleOffset)
            / (scaleOffsetNext - scaleOffset);
          vec4 colorLow = texture2D(scaleColormap, vec2((i_f + 0.5) / scaleLengthFloat, colorRow));
          vec4 colorHigh = texture2D(scaleColormap, vec2((i_f + 1.0 + 0.5) / scaleLengthFloat, colorRow));
          return mix(colorLow, colorHigh, percent);
        }
      }
    }
  }

  return DEFAULT_COLOR;
}

#pragma glslify: export(computeColor)
