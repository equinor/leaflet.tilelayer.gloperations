#pragma glslify: isCloseEnough = require(./isCloseEnough.glsl)
#pragma glslify: ScaleStop = require(./ScaleStop.glsl)

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
  ScaleStop colorScale[SCALE_MAX_LENGTH],
  ScaleStop sentinelValues[SENTINEL_MAX_LENGTH],
  int colorScaleLength,
  int sentinelValuesLength
) {
  // Compare the value against any sentinel values, if defined.
  if (sentinelValuesLength > 0) {
    for (int i = 0; i < SENTINEL_MAX_LENGTH; ++i) {
      if (i == sentinelValuesLength) {
        break;
      }
      ScaleStop sentinel = sentinelValues[i];
      if (isCloseEnough(inputVal, sentinel.offset)) {
        return sentinel.color;
      }
    }
  }

  // Do linear interpolation using the color scale, if defined.
  if (colorScaleLength > 0) {
    // If value below color scale range, clamp to lowest color stop.
    if (inputVal < colorScale[0].offset) {
      return colorScale[0].color;
    } else {
      for (int i = 0; i < SCALE_MAX_LENGTH; ++i) {
        // If value above color scale range, clamp to highest color stop.
        if (i == colorScaleLength) {
          return colorScale[i - 1].color;
        } else if (inputVal <= colorScale[i + 1].offset) {
          float percent = (inputVal - colorScale[i].offset)
            / (colorScale[i + 1].offset - colorScale[i].offset);
          return mix(colorScale[i].color, colorScale[i + 1].color, percent);
        }
      }
    }
  }

  return DEFAULT_COLOR;
}

#pragma glslify: export(computeColor)
