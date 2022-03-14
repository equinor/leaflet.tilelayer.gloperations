import REGL from 'regl';
import { Dictionary, DrawCommon, DrawTileInterpolateColor, DrawTileInterpolateColorOnly, DrawTileInterpolateValue } from '../types';
export declare function createDrawTileInterpolateValueCommand(regl: REGL.Regl, commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>, fragMacros: Dictionary<any>): REGL.DrawCommand<REGL.DefaultContext, DrawTileInterpolateValue.Props>;
export declare function createDrawTileInterpolateColorCommand(regl: REGL.Regl, commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>, fragMacros: Dictionary<any>): REGL.DrawCommand<REGL.DefaultContext, DrawTileInterpolateColor.Props>;
export declare function createDrawTileInterpolateColorOnlyCommand(regl: REGL.Regl, commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>, fragMacros: Dictionary<any>): REGL.DrawCommand<REGL.DefaultContext, DrawTileInterpolateColorOnly.Props>;
