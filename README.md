[![npm version](https://badge.fury.io/js/leaflet.tilelayer.gloperations.svg)](https://badge.fury.io/js/leaflet.tilelayer.gloperations)
[![Build Status](https://travis-ci.org/equinor/leaflet.tilelayer.gloperations.svg?branch=master)](https://travis-ci.org/github/equinor/leaflet.tilelayer.gloperations)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/equinor/leaflet.tilelayer.gloperations.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/equinor/leaflet.tilelayer.gloperations/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/equinor/leaflet.tilelayer.gloperations.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/equinor/leaflet.tilelayer.gloperations/context:javascript)
[![Known Vulnerabilities](https://snyk.io/test/github/equinor/leaflet.tilelayer.gloperations/badge.svg?targetFile=package.json)](https://snyk.io/test/github/equinor/leaflet.tilelayer.gloperations?targetFile=package.json)

# Leaflet.TileLayer.GLOperations

Custom Leaflet TileLayer using WebGL to do operations on and colorize floating-point pixels

## Resources
* [Demo](https://equinor.github.io/leaflet.tilelayer.gloperations/) (currently not working on mobile devices)
* [Wiki](https://github.com/equinor/leaflet.tilelayer.gloperations/wiki)

## Features

- GPU rendering
- A simple declarative API
- A small configuration language for describing how to colorize pixels
  - Interpolated color scale
  - Sentinel values with optional labels
- Raw float pixel value(s) provided to mouse event handlers
- _(optional)_ Hillshading
- _(optional)_ Contours
- _(optional)_ Animated per-pixel transitions when changing URL or colormaps
- _(optional)_ Load multiple tile layers, do operations on them and return result layer:
  - Difference between two tile layers
  - Analysis of multiple tile layers (supports 1-6 layers currently). Filter values and use a multiplier for each layer.
  - Return pixel values for both input and result layers
