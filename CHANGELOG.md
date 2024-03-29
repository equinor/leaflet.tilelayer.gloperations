# Changelog

## [Unreleased]

## [0.4.2]

### Added

- Added optional smoothing of input data for advanced hillshading:
  - `hsAdvSmoothInput` (default: false)
  - `hsAdvSmoothInputKernel` (default: 3)

## [0.4.1]

### Fixed

- Hillshading options set correctly if used in initial options.

## [0.4.0]

### Added

- Added advanced hillshading option. See [Wiki](https://github.com/equinor/leaflet.tilelayer.gloperations/wiki/Hillshading) for available options.
- Support for loading [DEM tile format](https://en.wikipedia.org/wiki/Digital_elevation_model)
- Can specify color as hex values (`#FF0000`) in addition to existing rgb format (`rgb(255,0,0)`).

### Changed

- Send colormaps as textures to webgl. Reduces the number of fragment uniforms used.

### Fixed

- Plugin now works on mobile devices. Advanced hillshading does not yet work on iOS devices, but works fine on Android.

## [0.3.0]

### Added

- New options to specify max length of color scale and sentinels:
  - `colorscaleMaxLength` (default: 16)
  - `sentinelMaxLength` (default: 16)
- New option required when using contours: `contourPane` specifies Leaflet pane containing the contour canvas. Necessary addition to fix positioning of canvas when using fractional zoom.

### Changed

- Workaround to remove dependency on 'OES_texture_float' extension.

## [0.2.0]

### Added

- Option to smooth contour input data
  - Set `contourSmoothInput` to enable
  - Set the convolution kernel size with `contourSmoothInputKernel`

### Changed

- `contourSmooth` option changed name to `contourSmoothLines`.

## [0.1.1]

### Added

- Initial release

[unreleased]: https://github.com/equinor/leaflet.tilelayer.gloperations/compare/v0.4.2...HEAD
[0.4.2]: https://github.com/equinor/leaflet.tilelayer.gloperations/compare/v0.4.1...v0.4.2
[0.4.1]: https://github.com/equinor/leaflet.tilelayer.gloperations/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/equinor/leaflet.tilelayer.gloperations/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/equinor/leaflet.tilelayer.gloperations/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/equinor/leaflet.tilelayer.gloperations/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/equinor/leaflet.tilelayer.gloperations/releases/tag/v0.1.1
