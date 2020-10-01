import REGL from 'regl';

import vertSingleNotTransformed from '../shaders/vertex/singleNotTransformed.vs';

import fragConvolutionSmooth from '../shaders/fragment/convolutionSmooth.fs';

import {
  DrawCommon,
  ConvolutionSmooth,
} from '../types';

/**
 * The resulting Regl DrawCommand is for using a convolution kernel to smooth the input data.
 * Currently hard-coded the kernel and positions in the shader to reduce number of uniforms.
 */
export function createConvolutionSmoothCommand(
	regl: REGL.Regl,
	commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>,
  ) {
	return regl<ConvolutionSmooth.Uniforms, ConvolutionSmooth.Attributes, ConvolutionSmooth.Props>({
	  vert: vertSingleNotTransformed,
	  frag: fragConvolutionSmooth,
	  uniforms: {
		...commonConfig.uniforms as DrawCommon.Uniforms,
		texture: regl.prop<ConvolutionSmooth.Props, 'texture'>("texture"),
		textureSize: regl.prop<ConvolutionSmooth.Props, 'textureSize'>("textureSize"),
		kernelSize: regl.prop<ConvolutionSmooth.Props, 'kernelSize'>("kernelSize"),
	  },
	  attributes: {
		texCoord: [0, 1, 1, 1, 0, 0, 1, 0],
		position: [-1, 1, 1, 1, -1, -1, 1, -1],
	  },
	  depth: { enable: false },
	  primitive: 'triangle strip',
	  count: 4,
	});
}
