import REGL from 'regl';
import { DrawCommon, ConvolutionSmooth } from '../types';
export declare function createConvolutionSmoothCommand(regl: REGL.Regl, commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>): REGL.DrawCommand<REGL.DefaultContext, ConvolutionSmooth.Props>;
