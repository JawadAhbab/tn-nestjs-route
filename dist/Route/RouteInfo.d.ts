import { RouteBodyInfo } from './RouteField/RouteBody';
import { RouteFileInfo } from './RouteField/RouteFile';
import { RouteParamInfo } from './RouteField/RouteParam';
import { RouteResultInfo } from './RouteField/RouteResult';
export interface RouteInfo {
    $route: true;
    route: string;
    params: RouteParamInfo[];
    bodies: RouteBodyInfo[];
    files: RouteFileInfo[];
    results: RouteResultInfo[];
}
export declare const createRouteInfo: (routecls: Function, resultcls?: Function) => RouteInfo;
