import { RouteBodyInfo } from './RouteField/RouteBody';
import { RouteFileInfo } from './RouteField/RouteFile';
import { RouteParamInfo } from './RouteField/RouteParam';
import { RouteResultInfo } from './RouteField/RouteResult';
type Method = 'GET' | 'POST';
export interface RouteInfo {
    $route: true;
    route: string;
    method: Method;
    name: string;
    params: RouteParamInfo[];
    bodies: RouteBodyInfo[];
    files: RouteFileInfo[];
    results: RouteResultInfo[];
}
export declare const createRouteInfo: (method: Method, routecls: Function, resultcls?: Function) => RouteInfo;
export {};
