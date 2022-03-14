import REGL from 'regl';
import { Dictionary, DrawCommon, DrawTile } from '../types';
export declare function createDrawTileCommand(regl: REGL.Regl, commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>, fragMacros: Dictionary<any>): REGL.DrawCommand<REGL.DefaultContext, DrawTile.Props>;
