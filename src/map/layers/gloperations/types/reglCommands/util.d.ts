import REGL from 'regl';
import { DrawCommon, ConvertDem } from '../types';
export declare function getCommonDrawConfiguration(tileSize: number, nodataValue: number): REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>;
export declare function createConvertDemCommand(regl: REGL.Regl, commonConfig: REGL.DrawConfig<DrawCommon.Uniforms, DrawCommon.Attributes, DrawCommon.Props>): REGL.DrawCommand<REGL.DefaultContext, ConvertDem.Props>;
